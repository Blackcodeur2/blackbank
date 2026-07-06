<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountType extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'description',
        'type',
        'requires_kyc',
        'allows_overdraft',
        'overdraft_limit',
        'minimum_balance',
        'monthly_fee',
        'features',
        'active',
    ];

    protected $casts = [
        'overdraft_limit' => 'decimal:2',
        'minimum_balance' => 'decimal:2',
        'monthly_fee' => 'decimal:2',
        'features' => 'array',
        'requires_kyc' => 'boolean',
        'allows_overdraft' => 'boolean',
        'active' => 'boolean',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
