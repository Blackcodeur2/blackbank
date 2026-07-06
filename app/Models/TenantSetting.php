<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantSetting extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'daily_deposit_limit',
        'daily_withdrawal_limit',
        'daily_transfer_limit',
        'single_transaction_limit',
        'kyc_required_for_transactions',
        'kyc_verification_level',
        'default_deposit_fee',
        'default_withdrawal_fee',
        'default_transfer_fee',
        'custom_settings',
    ];

    protected $casts = [
        'daily_deposit_limit' => 'decimal:2',
        'daily_withdrawal_limit' => 'decimal:2',
        'daily_transfer_limit' => 'decimal:2',
        'single_transaction_limit' => 'decimal:2',
        'default_deposit_fee' => 'decimal:2',
        'default_withdrawal_fee' => 'decimal:2',
        'default_transfer_fee' => 'decimal:2',
        'kyc_required_for_transactions' => 'boolean',
        'custom_settings' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(\Stancl\Tenancy\Database\Models\Tenant::class, 'tenant_id');
    }
}
