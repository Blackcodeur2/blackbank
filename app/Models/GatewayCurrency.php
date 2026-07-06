<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GatewayCurrency extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'gateway_id',
        'devise',
        'montant_min',
        'montant_max',
        'frais_fixe',
        'frais_pourcentage',
        'taux_change',
    ];

    protected $casts = [
        'montant_min' => 'decimal:2',
        'montant_max' => 'decimal:2',
        'frais_fixe' => 'decimal:2',
        'frais_pourcentage' => 'decimal:2',
        'taux_change' => 'decimal:4',
    ];

    public function gateway(): BelongsTo
    {
        return $this->belongsTo(PaymentGateway::class, 'gateway_id');
    }
}
