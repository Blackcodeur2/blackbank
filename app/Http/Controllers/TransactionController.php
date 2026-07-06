<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display all transactions for the authenticated user.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $transactions = Transaction::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        $beneficiaries = \App\Models\Beneficiary::where('user_id', $user->id)
            ->orderBy('libelle')
            ->get();

        return Inertia::render('transactions/index', [
            'transactions'  => $transactions,
            'user'          => $user,
            'beneficiaries' => $beneficiaries,
        ]);
    }

    /**
     * Handle a manual deposit request (admin-validated).
     */
    public function deposit(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'montant'     => ['required', 'numeric', 'min:1'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $user = Auth::user();

        Transaction::create([
            'user_id'     => $user->id,
            'type'        => 'depot',
            'montant'     => $request->montant,
            'statut'      => 'en_attente',
            'description' => $request->description ?? 'Demande de dépôt',
            'reference'   => 'DEP-' . strtoupper(uniqid()),
        ]);

        return back()->with('success', 'Votre demande de dépôt a été soumise. Elle sera validée par un administrateur.');
    }

    /**
     * Handle a withdrawal request.
     */
    public function withdraw(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'montant'     => ['required', 'numeric', 'min:1'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $user = Auth::user();

        if (bccomp((string) $user->solde, (string) $request->montant, 2) < 0) {
            return back()->withErrors(['montant' => 'Solde insuffisant.']);
        }

        DB::transaction(function () use ($user, $request) {
            // Lock user row for update to prevent race conditions
            $freshUser = \App\Models\User::lockForUpdate()->find($user->id);

            if (bccomp((string) $freshUser->solde, (string) $request->montant, 2) < 0) {
                throw new \RuntimeException('Solde insuffisant.');
            }

            Transaction::create([
                'user_id'     => $freshUser->id,
                'type'        => 'retrait',
                'montant'     => $request->montant,
                'statut'      => 'en_attente',
                'description' => $request->description ?? 'Demande de retrait',
                'reference'   => 'RET-' . strtoupper(uniqid()),
            ]);
        });

        return back()->with('success', 'Votre demande de retrait a été soumise. Elle sera traitée sous 24–48h.');
    }

    /**
     * Handle an internal transfer between BlackBank users.
     */
    public function transfer(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email_destinataire' => ['required', 'email', 'exists:users,email'],
            'montant'            => ['required', 'numeric', 'min:1'],
            'description'        => ['nullable', 'string', 'max:255'],
        ]);

        $sender = Auth::user();

        if ($sender->email === $request->email_destinataire) {
            return back()->withErrors(['email_destinataire' => 'Vous ne pouvez pas vous transférer à vous-même.']);
        }

        DB::transaction(function () use ($sender, $request) {
            $sender = \App\Models\User::lockForUpdate()->find($sender->id);
            $recipient = \App\Models\User::lockForUpdate()->where('email', $request->email_destinataire)->firstOrFail();

            if (bccomp((string) $sender->solde, (string) $request->montant, 2) < 0) {
                throw new \RuntimeException('Solde insuffisant.');
            }

            $newSenderBalance = bcsub((string) $sender->solde, (string) $request->montant, 2);
            $newRecipientBalance = bcadd((string) $recipient->solde, (string) $request->montant, 2);

            $sender->update(['solde' => $newSenderBalance]);
            $recipient->update(['solde' => $newRecipientBalance]);

            $ref = 'TRF-' . strtoupper(uniqid());

            // Sender transaction (debit)
            Transaction::create([
                'user_id'     => $sender->id,
                'type'        => 'virement_interne',
                'montant'     => $request->montant,
                'statut'      => 'reussie',
                'description' => $request->description ?? "Transfert vers {$recipient->name}",
                'reference'   => $ref . '-OUT',
                'metadonnees' => ['type_transfert' => 'envoye', 'destinataire_email' => $recipient->email],
            ]);

            // Recipient transaction (credit)
            Transaction::create([
                'user_id'     => $recipient->id,
                'type'        => 'virement_interne',
                'montant'     => $request->montant,
                'statut'      => 'reussie',
                'description' => "Transfert reçu de {$sender->name}",
                'reference'   => $ref . '-IN',
                'metadonnees' => ['type_transfert' => 'recu', 'expediteur_email' => $sender->email],
            ]);
        });

        return back()->with('success', 'Transfert effectué avec succès.');
    }
}
