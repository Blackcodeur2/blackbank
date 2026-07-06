<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AirtimeController extends Controller
{
    /**
     * Display the airtime purchase form.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $history = Transaction::where('user_id', $user->id)
            ->where('type', 'frais') // Airtime is stored as 'frais' type
            ->whereJsonContains('metadonnees->type', 'airtime')
            ->orderByDesc('created_at')
            ->take(10)
            ->get();

        return Inertia::render('airtime/index', [
            'user'    => $user,
            'history' => $history,
        ]);
    }

    /**
     * Process an airtime purchase.
     */
    public function purchase(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'telephone'  => ['required', 'string', 'regex:/^[0-9\s\+\-]{8,15}$/'],
            'operateur'  => ['required', 'in:orange,mtn,moov,airtel,other'],
            'montant'    => ['required', 'numeric', 'min:1', 'max:50000'],
        ]);

        $user = Auth::user();
        $montant = (float) $request->montant;

        DB::transaction(function () use ($user, $request, $montant) {
            $fresh = \App\Models\User::where('id', $user->id)->lockForUpdate()->first();

            if (bccomp((string) $fresh->solde, (string) $montant, 2) < 0) {
                throw new \Exception('Solde insuffisant pour effectuer cette recharge.');
            }

            $fresh->decrement('solde', $montant);

            Transaction::create([
                'user_id'     => $fresh->id,
                'type'        => 'frais',
                'montant'     => -$montant,
                'statut'      => 'reussie',
                'reference'   => 'AIRTIME-' . strtoupper(Str::random(12)),
                'metadonnees' => [
                    'type'       => 'airtime',
                    'telephone'  => $request->telephone,
                    'operateur'  => $request->operateur,
                    'montant'    => $montant,
                ],
            ]);
        });

        return back()->with('success', "Recharge de {$montant}€ envoyée sur le {$request->telephone} ({$request->operateur}) avec succès.");
    }
}
