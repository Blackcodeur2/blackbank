<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithdrawalMethod extends Model
{
    use HasFactory, HasUuids, BelongsToTenant;

    protected $fillable = [
        'nom',
        'devise',
        'montant_min',
        'montant_max',
        'frais_fixe',
        'frais_pourcentage',
        'instructions',
        'formulaire_dynamique',
        'actif',
    ];

    protected $casts = [
        'montant_min' => 'decimal:2',
        'montant_max' => 'decimal:2',
        'frais_fixe' => 'decimal:2',
        'frais_pourcentage' => 'decimal:2',
        'formulaire_dynamique' => 'json',
        'actif' => 'boolean',
    ];
}
