<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureKycVerified
{
    /**
     * Handle an incoming request.
     * Blocks access to financial features unless the user's KYC status is 'verifie'.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->statut_kyc !== 'verifie') {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Votre compte doit être vérifié (KYC) pour accéder à cette fonctionnalité.',
                    'kyc_status' => $user?->statut_kyc ?? 'non_soumis',
                ], 403);
            }

            return redirect()->route('kyc.index')->with(
                'warning',
                'Veuillez compléter la vérification de votre identité (KYC) pour accéder à cette fonctionnalité.'
            );
        }

        return $next($request);
    }
}
