<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends BaseTenant
{
    use HasDomains;

    // Les données personnalisées sont stockées dans le champ JSON 'data'
    // On peut y accéder via des magic getters
    
    public function getNameAttribute()
    {
        return $this->data['name'] ?? null;
    }
    
    public function getSlugAttribute()
    {
        return $this->data['slug'] ?? null;
    }
    
    public function getEmailAttribute()
    {
        return $this->data['email'] ?? null;
    }
    
    public function getPhoneAttribute()
    {
        return $this->data['phone'] ?? null;
    }
    
    public function getAddressAttribute()
    {
        return $this->data['address'] ?? null;
    }
    
    public function getLogoAttribute()
    {
        return $this->data['logo'] ?? null;
    }
    
    public function getPrimaryColorAttribute()
    {
        return $this->data['primary_color'] ?? '#3b82f6';
    }
    
    public function getSecondaryColorAttribute()
    {
        return $this->data['secondary_color'] ?? '#1e40af';
    }
    
    public function getDefaultCurrencyAttribute()
    {
        return $this->data['default_currency'] ?? 'XAF';
    }
    
    public function getTimezoneAttribute()
    {
        return $this->data['timezone'] ?? 'Africa/Douala';
    }
    
    public function getStatusAttribute()
    {
        return $this->data['status'] ?? 'active';
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(TenantSubscription::class, 'tenant_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
