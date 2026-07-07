<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasPermission
{
    /**
     * Handle an incoming request.
     * Check if user has the required permission.
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (! $user || ! $user->can($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès interdit. Permission requise.'], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Vous n’avez pas les permissions nécessaires pour accéder à cette page.');
        }

        return $next($request);
    }
}
