<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, ['admin', 'super_admin'])) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès interdit. Rôle administratif requis.'], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Vous n’avez pas les droits d’accès à cette page.');
        }

        return $next($request);
    }
}
