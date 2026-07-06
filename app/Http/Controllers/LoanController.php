<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoanController extends Controller
{
    /**
     * Display available loan plans and user's active loans.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $plans = LoanPlan::all();

        $myLoans = Loan::where('user_id', $user->id)
            ->with(['plan', 'repayments'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('loans/index', [
            'user'    => $user,
            'plans'   => $plans,
            'myLoans' => $myLoans,
        ]);
    }

    /**
     * Apply for a loan.
     */
    public function apply(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'loan_plan_id' => ['required', 'exists:loan_plans,id'],
            'montant'      => ['required', 'numeric', 'min:100'],
            'duree_mois'   => ['required', 'integer', 'min:1'],
            'motif'        => ['nullable', 'string', 'max:500'],
        ]);

        $user = Auth::user();
        $plan = LoanPlan::findOrFail($request->loan_plan_id);

        // Check if user already has an active or pending loan
        $activeLoans = Loan::where('user_id', $user->id)
            ->whereIn('statut', ['en_attente', 'approuve'])
            ->count();

        if ($activeLoans > 0) {
            return back()->withErrors([
                'loan_plan_id' => 'Vous avez déjà un prêt actif ou en attente de validation.',
            ]);
        }

        if (bccomp((string) $request->montant, (string) $plan->montant_min, 2) < 0
            || bccomp((string) $request->montant, (string) $plan->montant_max, 2) > 0) {
            return back()->withErrors([
                'montant' => "Le montant doit être entre {$plan->montant_min} et {$plan->montant_max} €.",
            ]);
        }

        Loan::create([
            'user_id'      => $user->id,
            'loan_plan_id' => $plan->id,
            'montant'      => $request->montant,
            'duree_mois'   => $request->duree_mois,
            'taux_interet' => $plan->taux_interet,
            'motif'        => $request->motif,
            'statut'       => 'en_attente',
        ]);

        return back()->with('success', 'Votre demande de prêt a été soumise. Elle sera examinée sous 2–3 jours ouvrés.');
    }
}
