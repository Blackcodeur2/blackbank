<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    /**
     * Display the KYC submission page.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $documents = $user->kycDocuments()->latest()->get();

        return Inertia::render('kyc/index', [
            'user'      => $user,
            'documents' => $documents,
            'statut'    => $user->statut_kyc,
        ]);
    }

    /**
     * Store a newly submitted KYC document.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'type'     => ['required', 'string', 'in:identite,passeport,permis,justificatif_domicile,photo'],
            'fichier'  => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf'],
        ]);

        $user = Auth::user();

        // Store file locally in storage/app/kyc/{user_id}/
        $path = $request->file('fichier')->store("kyc/{$user->id}", 'local');

        KycDocument::create([
            'user_id'    => $user->id,
            'type'       => $request->type,
            'fichier'    => $path,
            'statut'     => 'en_attente',
        ]);

        // Update user KYC status to 'en_attente' if it was 'non_soumis'
        if ($user->statut_kyc === 'non_soumis') {
            $user->update(['statut_kyc' => 'en_attente']);
        }

        return back()->with('success', 'Document soumis avec succès. En attente de vérification.');
    }
}
