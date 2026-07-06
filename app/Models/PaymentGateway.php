<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentGateway extends Model
{
    use HasFactory, HasUuids, BelongsToTenant;

    protected $fillable = [
        'nom',
        'type',
        'configuration',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'configuration' => 'encrypted:json',
    ];

    public function currencies(): HasMany
    {
        return $this->hasMany(GatewayCurrency::class, 'gateway_id');
    }
}
