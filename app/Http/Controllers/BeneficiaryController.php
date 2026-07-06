<?php

namespace App\Http\Controllers;

use App\Models\Beneficiary;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BeneficiaryController extends Controller
{
    /**
     * Display a listing of the beneficiaries.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $beneficiaries = Beneficiary::where('user_id', $user->id)
            ->orderBy('libelle')
            ->get();

        return Inertia::render('beneficiaries/index', [
            'beneficiaries' => $beneficiaries,
        ]);
    }

    /**
     * Store a newly created beneficiary.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'numero_compte' => ['required', 'email', 'exists:users,email'],
            'libelle'       => ['required', 'string', 'max:255'],
        ], [
            'numero_compte.exists' => "Aucun utilisateur trouvé avec cette adresse email.",
        ]);

        $user = Auth::user();

        if ($request->numero_compte === $user->email) {
            return back()->withErrors(['numero_compte' => "Vous ne pouvez pas vous ajouter comme bénéficiaire."]);
        }

        // Check if already exists for this user
        $exists = Beneficiary::where('user_id', $user->id)
            ->where('numero_compte', $request->numero_compte)
            ->exists();

        if ($exists) {
            return back()->withErrors(['numero_compte' => "Ce bénéficiaire est déjà enregistré."]);
        }

        // Find recipient user to get their name
        $recipient = User::where('email', $request->numero_compte)->firstOrFail();

        Beneficiary::create([
            'user_id'       => $user->id,
            'nom'           => $recipient->name,
            'numero_compte' => $recipient->email,
            'libelle'       => $request->libelle,
        ]);

        return back()->with('success', 'Bénéficiaire ajouté avec succès.');
    }

    /**
     * Remove the specified beneficiary.
     */
    public function destroy(Beneficiary $beneficiary): \Illuminate\Http\RedirectResponse
    {
        // Enforce ownership
        if ($beneficiary->user_id !== Auth::id()) {
            abort(403);
        }

        $beneficiary->delete();

        return back()->with('success', 'Bénéficiaire supprimé avec succès.');
    }
}
