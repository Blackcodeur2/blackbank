<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Tenancy;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedException;

class InitializeTenant
{
    public function __construct(
        protected Tenancy $tenancy
    ) {}

    public function handle(Request $request, Closure $next)
    {
        // Skip tenant initialization for central domains (landlord panel)
        $centralDomains = config('tenancy.central_domains', ['localhost', '127.0.0.1']);
        $host = $request->getHost();

        if (in_array($host, $centralDomains)) {
            return $next($request);
        }

        // Resolve tenant from subdomain
        $subdomain = explode('.', $host)[0] ?? null;

        if (!$subdomain) {
            return $next($request);
        }

        try {
            $tenant = \Stancl\Tenancy\Database\Models\Tenant::where('slug', $subdomain)->first();

            if (!$tenant) {
                abort(404, 'Tenant not found');
            }

            $this->tenancy->initialize($tenant);
            
            // Store tenant_id in request for later use
            $request->merge(['tenant_id' => $tenant->id]);

        } catch (TenantCouldNotBeIdentifiedException $e) {
            abort(404, 'Tenant could not be identified');
        }

        return $next($request);
    }
}
