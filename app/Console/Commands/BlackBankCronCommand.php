<?php

namespace App\Console\Commands;

use App\Models\Loan;
use App\Models\LoanRepayment;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlackBankCronCommand extends Command
{
    protected $signature   = 'blackbank:cron';
    protected $description = 'Process daily BlackBank automated tasks: FDR interest crediting, DPS installment debits, and loan repayment debits.';

    public function handle(): int
    {
        $this->info('[BlackBank Cron] Starting...');

        $this->processFdrInterests();
        $this->processDpsInstallments();
        $this->processLoanRepayments();

        $this->info('[BlackBank Cron] Done.');

        return self::SUCCESS;
    }

    /**
     * FDR — Credit accrued interests to clients whose savings plan interest interval has passed.
     */
    private function processFdrInterests(): void
    {
        $this->info('  [FDR] Processing interest credits...');

        $plans = SavingsPlan::where('type_plan', 'fdr')
            ->where('statut', 'actif')
            ->where('date_fin', '>', now())
            ->get();

        foreach ($plans as $plan) {
            // Calculate daily interest = (montant * taux_interet/100) / 365
            $dailyInterest = bcdiv(
                bcmul((string) $plan->montant, bcdiv((string) $plan->taux_interet, '100', 8), 8),
                '365',
                2
            );

            // Apply interest interval: default 30 days
            $intervalDays = $plan->intervalle_versement_interets ?? 30;
            $lastPayment  = $plan->payments()
                ->where('type', 'interet')
                ->orderByDesc('created_at')
                ->first();

            $lastDate = $lastPayment ? $lastPayment->created_at : $plan->date_debut;
            $daysSince = now()->diffInDays($lastDate);

            if ($daysSince < $intervalDays) {
                continue;
            }

            $interest = bcmul($dailyInterest, (string) $intervalDays, 2);

            DB::transaction(function () use ($plan, $interest) {
                $user = \App\Models\User::where('id', $plan->user_id)->lockForUpdate()->first();
                $user->increment('solde', $interest);

                Transaction::create([
                    'user_id'     => $user->id,
                    'type'        => 'interet',
                    'montant'     => $interest,
                    'statut'      => 'reussie',
                    'reference'   => 'FDR-INT-' . strtoupper(Str::random(10)),
                    'metadonnees' => ['savings_plan_id' => $plan->id],
                ]);

                // Record interest payment
                $plan->payments()->create([
                    'montant'    => $interest,
                    'type'       => 'interet',
                    'statut'     => 'reussie',
                    'reference'  => 'FDR-INT-' . strtoupper(Str::random(10)),
                ]);
            });

            $this->line("    FDR plan {$plan->id}: credited {$interest}€ interest to user {$plan->user_id}");
        }
    }

    /**
     * DPS — Debit periodic installments from clients who have an active DPS savings plan.
     */
    private function processDpsInstallments(): void
    {
        $this->info('  [DPS] Processing installment debits...');

        $plans = SavingsPlan::where('type_plan', 'dps')
            ->where('statut', 'actif')
            ->where('date_fin', '>', now())
            ->get();

        foreach ($plans as $plan) {
            // Get expected installment amount
            $installmentAmount = bcdiv(
                (string) $plan->montant,
                (string) max(1, $plan->nombre_echeances),
                2
            );

            // Count payments already done
            $paymentsDone = $plan->payments()->where('type', 'depot')->count();
            if ($paymentsDone >= $plan->nombre_echeances) {
                // Fully paid — mark as completed
                $plan->update(['statut' => 'termine']);
                continue;
            }

            // Check interval since last payment
            $lastPayment  = $plan->payments()->where('type', 'depot')->orderByDesc('created_at')->first();
            $lastDate     = $lastPayment ? $lastPayment->created_at : $plan->date_debut;
            $intervalDays = $plan->intervalle_versement ?? 30;
            $daysSince    = now()->diffInDays($lastDate);

            if ($daysSince < $intervalDays) {
                continue;
            }

            DB::transaction(function () use ($plan, $installmentAmount) {
                $user = \App\Models\User::where('id', $plan->user_id)->lockForUpdate()->first();

                if (bccomp((string) $user->solde, $installmentAmount, 2) < 0) {
                    // Insufficient funds — apply late fee if configured
                    $lateFee = $plan->frais_retard_fixe ?? 0;
                    if ($lateFee > 0) {
                        $user->decrement('solde', $lateFee);

                        Transaction::create([
                            'user_id'     => $user->id,
                            'type'        => 'frais',
                            'montant'     => -$lateFee,
                            'statut'      => 'reussie',
                            'reference'   => 'DPS-LATE-' . strtoupper(Str::random(10)),
                            'metadonnees' => ['savings_plan_id' => $plan->id, 'raison' => 'retard_dps'],
                        ]);
                    }

                    $this->warn("    DPS plan {$plan->id}: user {$plan->user_id} has insufficient balance. Late fee applied: {$lateFee}€");
                    return;
                }

                $user->decrement('solde', $installmentAmount);

                Transaction::create([
                    'user_id'     => $user->id,
                    'type'        => 'frais',
                    'montant'     => -$installmentAmount,
                    'statut'      => 'reussie',
                    'reference'   => 'DPS-INST-' . strtoupper(Str::random(10)),
                    'metadonnees' => ['savings_plan_id' => $plan->id, 'raison' => 'echeance_dps'],
                ]);

                $plan->payments()->create([
                    'montant'   => $installmentAmount,
                    'type'      => 'depot',
                    'statut'    => 'reussie',
                    'reference' => 'DPS-INST-' . strtoupper(Str::random(10)),
                ]);
            });

            $this->line("    DPS plan {$plan->id}: debited {$installmentAmount}€ installment from user {$plan->user_id}");
        }
    }

    /**
     * LOANS — Debit due repayments for approved loans.
     */
    private function processLoanRepayments(): void
    {
        $this->info('  [LOANS] Processing due repayments...');

        $dueRepayments = LoanRepayment::where('statut', 'en_attente')
            ->where('date_echeance', '<=', now())
            ->with('loan.user')
            ->get();

        foreach ($dueRepayments as $repayment) {
            $loan = $repayment->loan;
            if (!$loan || $loan->statut !== 'approuve') {
                continue;
            }

            $user = $loan->user;
            $amountDue = bcadd((string) $repayment->montant_du, (string) ($repayment->penalite_retard ?? 0), 2);

            DB::transaction(function () use ($user, $repayment, $loan, $amountDue) {
                $fresh = \App\Models\User::where('id', $user->id)->lockForUpdate()->first();

                if (bccomp((string) $fresh->solde, $amountDue, 2) < 0) {
                    // Mark as late
                    $repayment->update(['statut' => 'en_retard']);
                    $this->warn("    Loan repayment {$repayment->id}: user {$user->id} insufficient balance. Marked as late.");
                    return;
                }

                $fresh->decrement('solde', $amountDue);

                Transaction::create([
                    'user_id'     => $fresh->id,
                    'type'        => 'frais',
                    'montant'     => -$amountDue,
                    'statut'      => 'reussie',
                    'reference'   => 'LOAN-RPY-' . strtoupper(Str::random(10)),
                    'metadonnees' => [
                        'loan_id'            => $loan->id,
                        'repayment_id'       => $repayment->id,
                        'numero_echeance'    => $repayment->numero_echeance,
                    ],
                ]);

                $repayment->update(['statut' => 'paye']);

                // Check if all repayments are paid → mark loan as 'solde'
                $remaining = LoanRepayment::where('loan_id', $loan->id)
                    ->whereNotIn('statut', ['paye'])
                    ->count();

                if ($remaining === 0) {
                    $loan->update(['statut' => 'solde']);
                }
            });

            $this->line("    Loan {$loan->id} / repayment #{$repayment->numero_echeance}: debited {$amountDue}€ from user {$user->id}");
        }
    }
}
