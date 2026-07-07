<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Domain;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $this->authorize('manage tenants');

        $tenants = Tenant::with(['domains', 'subscription.plan'])->get();

        return Inertia::render('tenants/index', [
            'tenants' => $tenants,
            'plans' => SubscriptionPlan::where('active', true)->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('manage tenants');

        return Inertia::render('tenants/create', [
            'plans' => SubscriptionPlan::where('active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('manage tenants');

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'default_currency' => 'nullable|string|max:3',
            'timezone' => 'nullable|string|max:50',
            'domain' => 'required|string|max:191',
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $tenant = Tenant::create([
            'id' => $request->slug,
            'name' => $request->name,
            'data' => [
                'slug' => $request->slug,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'primary_color' => $request->primary_color ?? '#3b82f6',
                'secondary_color' => $request->secondary_color ?? '#1e40af',
                'default_currency' => $request->default_currency ?? 'XAF',
                'timezone' => $request->timezone ?? 'Africa/Douala',
                'status' => 'active',
            ],
        ]);

        Domain::create([
            'domain' => $request->domain,
            'tenant_id' => $tenant->id,
        ]);

        $plan = SubscriptionPlan::find($request->plan_id);
        $price = $request->billing_cycle === 'yearly' ? $plan->price_yearly : $plan->price_monthly;
        $startDate = now();
        $endDate = $request->billing_cycle === 'yearly' ? $startDate->copy()->addYear() : $startDate->copy()->addMonth();

        TenantSubscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $request->plan_id,
            'billing_cycle' => $request->billing_cycle,
            'price' => $price,
            'starts_at' => $startDate,
            'ends_at' => $endDate,
            'status' => 'active',
        ]);

        return redirect()->route('tenants.index')->with('success', 'Tenant créé avec succès.');
    }

    public function show(Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $tenant->load(['domains', 'subscription.plan', 'users']);

        return Inertia::render('tenants/show', [
            'tenant' => $tenant,
        ]);
    }

    public function edit(Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $tenant->load(['domains', 'subscription']);

        return Inertia::render('tenants/edit', [
            'tenant' => $tenant,
            'plans' => SubscriptionPlan::where('active', true)->get(),
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'default_currency' => 'nullable|string|max:3',
            'timezone' => 'nullable|string|max:50',
            'status' => 'required|in:active,suspended,deleted',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $tenant->update([
            'name' => $request->name,
            'data' => array_merge($tenant->data, [
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'primary_color' => $request->primary_color,
                'secondary_color' => $request->secondary_color,
                'default_currency' => $request->default_currency,
                'timezone' => $request->timezone,
                'status' => $request->status,
            ]),
        ]);

        return redirect()->route('tenants.index')->with('success', 'Tenant mis à jour avec succès.');
    }

    public function destroy(Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $tenant->update(['data' => array_merge($tenant->data, ['status' => 'deleted'])]);
        $tenant->domains()->delete();

        return redirect()->route('tenants.index')->with('success', 'Tenant supprimé avec succès.');
    }

    public function suspend(Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $tenant->update(['data' => array_merge($tenant->data, ['status' => 'suspended'])]);

        return redirect()->back()->with('success', 'Tenant suspendu avec succès.');
    }

    public function activate(Tenant $tenant)
    {
        $this->authorize('manage tenants');

        $tenant->update(['data' => array_merge($tenant->data, ['status' => 'active'])]);

        return redirect()->back()->with('success', 'Tenant activé avec succès.');
    }
}
