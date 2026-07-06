<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KycDocument;
use App\Models\Transaction;
use App\Models\Loan;
use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the Admin Dashboard.
     */
    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_deposits' => Transaction::where('type', 'depot')->where('statut', 'reussie')->sum('montant'),
            'total_withdrawals' => Transaction::where('type', 'retrait')->where('statut', 'reussie')->sum('montant'),
            'pending_kyc' => User::where('statut_kyc', 'en_attente')->count(),
            'pending_loans' => Loan::where('statut', 'en_attente')->count(),
            'pending_deposits' => Transaction::where('type', 'depot')->where('statut', 'en_attente')->count(),
            'pending_withdrawals' => Transaction::where('type', 'retrait')->where('statut', 'en_attente')->count(),
        ];

        $pendingKycUsers = User::where('statut_kyc', 'en_attente')
            ->with('kycDocuments')
            ->orderBy('updated_at', 'desc')
            ->get();

        $pendingLoans = Loan::where('statut', 'en_attente')
            ->with(['user', 'plan'])
            ->orderBy('created_at', 'asc')
            ->get();

        $pendingDeposits = Transaction::where('type', 'depot')
            ->where('statut', 'en_attente')
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        $pendingWithdrawals = Transaction::where('type', 'retrait')
            ->where('statut', 'en_attente')
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'pendingKycUsers' => $pendingKycUsers,
            'pendingLoans' => $pendingLoans,
            'pendingDeposits' => $pendingDeposits,
            'pendingWithdrawals' => $pendingWithdrawals,
        ]);
    }

    /**
     * Approve user KYC verification.
     */
    public function approveKyc(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $user->update(['statut_kyc' => 'verifie']);

        // Update all pending documents for this user
        $user->kycDocuments()->where('statut', 'en_attente')->update([
            'statut' => 'approuve',
        ]);

        return back()->with('success', "Le KYC de {$user->name} a été vérifié et approuvé avec succès.");
    }

    /**
     * Reject user KYC verification.
     */
    public function rejectKyc(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'motif' => ['required', 'string', 'max:255'],
        ]);

        $user->update(['statut_kyc' => 'rejete']);

        // Update pending documents for this user
        $user->kycDocuments()->where('statut', 'en_attente')->update([
            'statut' => 'rejete',
            'commentaire' => $request->motif,
        ]);

        return back()->with('success', "Le KYC de {$user->name} a été rejeté avec le motif fourni.");
    }

    /**
     * Approve a manual deposit transaction.
     */
    public function approveDeposit(Request $request, Transaction $transaction): \Illuminate\Http\RedirectResponse
    {
        if ($transaction->type !== 'depot' || $transaction->statut !== 'en_attente') {
            return back()->withErrors(['error' => 'Cette transaction ne peut pas être approuvée.']);
        }

        DB::transaction(function () use ($transaction) {
            $user = User::lockForUpdate()->findOrFail($transaction->user_id);
            
            $user->update([
                'solde' => bcadd((string) $user->solde, (string) $transaction->montant, 2),
            ]);

            $transaction->update([
                'statut' => 'reussie',
            ]);
        });

        return back()->with('success', 'Le dépôt a été approuvé et le compte du client a été crédité.');
    }

    /**
     * Reject a deposit or withdrawal transaction.
     */
    public function rejectTransaction(Request $request, Transaction $transaction): \Illuminate\Http\RedirectResponse
    {
        if ($transaction->statut !== 'en_attente') {
            return back()->withErrors(['error' => 'Cette transaction ne peut pas être rejetée.']);
        }

        $transaction->update([
            'statut' => 'echouee',
        ]);

        return back()->with('success', 'La demande a été rejetée avec succès.');
    }

    /**
     * Approve a manual withdrawal transaction.
     */
    public function approveWithdrawal(Request $request, Transaction $transaction): \Illuminate\Http\RedirectResponse
    {
        if ($transaction->type !== 'retrait' || $transaction->statut !== 'en_attente') {
            return back()->withErrors(['error' => 'Cette transaction ne peut pas être approuvée.']);
        }

        DB::transaction(function () use ($transaction) {
            $user = User::lockForUpdate()->findOrFail($transaction->user_id);
            
            // Check if user still has enough balance
            if (bccomp((string) $user->solde, (string) $transaction->montant, 2) < 0) {
                $transaction->update(['statut' => 'echouee']);
                throw new \RuntimeException('Solde du client insuffisant pour effectuer le retrait.');
            }

            $user->update([
                'solde' => bcsub((string) $user->solde, (string) $transaction->montant, 2),
            ]);

            $transaction->update([
                'statut' => 'reussie',
            ]);
        });

        return back()->with('success', 'Le retrait a été approuvé et le compte du client a été débité.');
    }

    /**
     * Approve a loan application.
     */
    public function approveLoan(Request $request, Loan $loan): \Illuminate\Http\RedirectResponse
    {
        if ($loan->statut !== 'en_attente') {
            return back()->withErrors(['error' => 'Ce prêt ne peut pas être approuvé.']);
        }

        DB::transaction(function () use ($loan) {
            $user = User::lockForUpdate()->findOrFail($loan->user_id);
            $plan = $loan->plan;

            // Simple interest amortization calculation
            // Interest = Principal * (Rate / 100) * (Months / 12)
            $totalInterets = bcmul(
                bcmul((string) $loan->montant, bcdiv((string) $loan->taux_interet, '100', 4), 4),
                bcdiv((string) $loan->duree_mois, '12', 4),
                2
            );
            $totalRemboursement = bcadd((string) $loan->montant, $totalInterets, 2);
            $mensualite = bcdiv($totalRemboursement, (string) $loan->duree_mois, 2);

            $loan->update([
                'statut' => 'actif',
                'date_debut' => now(),
            ]);

            // Create loan repayments schedule
            for ($i = 1; $i <= $loan->duree_mois; $i++) {
                $loan->repayments()->create([
                    'numero_echeance' => $i,
                    'montant_du' => $mensualite,
                    'date_echeance' => now()->addMonths($i),
                    'statut' => 'en_attente',
                    'penalite_retard' => 0.00,
                ]);
            }

            // Credit the client account
            $user->update([
                'solde' => bcadd((string) $user->solde, (string) $loan->montant, 2),
            ]);

            // Create transaction for loan payout
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'virement_interne',
                'montant' => $loan->montant,
                'statut' => 'reussie',
                'description' => "Versement du prêt: {$plan->nom}",
                'reference' => 'LOAN-' . strtoupper(uniqid()),
                'metadonnees' => ['loan_id' => $loan->id],
            ]);
        });

        return back()->with('success', 'Le prêt a été approuvé, l’échéancier a été généré et les fonds ont été crédités.');
    }

    /**
     * Reject a loan application.
     */
    public function rejectLoan(Request $request, Loan $loan): \Illuminate\Http\RedirectResponse
    {
        if ($loan->statut !== 'en_attente') {
            return back()->withErrors(['error' => 'Ce prêt ne peut pas être rejeté.']);
        }

        $loan->update([
            'statut' => 'rejete',
        ]);

        return back()->with('success', 'La demande de prêt a été rejetée.');
    }
}
