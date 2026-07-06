<?php

namespace App\Http\Controllers;

use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SavingsController extends Controller
{
    /**
     * Display the savings page.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $myPlans = SavingsPlan::where('user_id', $user->id)
            ->with('payments')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('savings/index', [
            'user'    => $user,
            'myPlans' => $myPlans,
        ]);
    }

    /**
     * Subscribe to a savings plan (DPS or FDR).
     */
    public function subscribe(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'type'       => ['required', 'in:DPS,FDR'],
            'montant'    => ['required', 'numeric', 'min:100'],
            'duree_mois' => ['required', 'integer', 'min:1', 'max:120'],
        ]);

        $user = Auth::user();

        if (bccomp((string) $user->solde, (string) $request->montant, 2) < 0) {
            return back()->withErrors(['montant' => 'Solde insuffisant pour souscrire à ce plan.']);
        }

        // DPS = 5% / an, FDR = 7.5% / an
        $tauxAnnuel = $request->type === 'FDR' ? '7.50' : '5.00';
        $dateDebut  = now();
        $dateFin    = now()->addMonths((int) $request->duree_mois);

        DB::transaction(function () use ($user, $request, $tauxAnnuel, $dateDebut, $dateFin) {
            $freshUser = \App\Models\User::lockForUpdate()->find($user->id);

            if (bccomp((string) $freshUser->solde, (string) $request->montant, 2) < 0) {
                throw new \RuntimeException('Solde insuffisant.');
            }

            $newBalance = bcsub((string) $freshUser->solde, (string) $request->montant, 2);
            $freshUser->update(['solde' => $newBalance]);

            SavingsPlan::create([
                'user_id'    => $freshUser->id,
                'type_plan'  => strtolower($request->type),
                'montant'    => $request->montant,
                'taux_interet' => $tauxAnnuel,
                'date_debut' => $dateDebut,
                'date_fin'   => $dateFin,
                'statut'     => 'actif',
            ]);

            Transaction::create([
                'user_id'     => $freshUser->id,
                'type'        => 'virement_interne',
                'montant'     => $request->montant,
                'statut'      => 'reussie',
                'description' => "Souscription plan épargne {$request->type}",
                'reference'   => 'SAV-' . strtoupper(uniqid()),
            ]);
        });

        return back()->with('success', "Votre plan d'épargne {$request->type} a été activé avec succès.");
    }
}
