<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoanPlan extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nom',
        'montant_min',
        'montant_max',
        'montant_par_echeance',
        'intervalle',
        'nombre_echeances',
        'taux_interet',
        'delai_retard_jours',
        'frais_retard_fixe',
        'frais_retard_pourcentage',
        'formulaire_dynamique',
    ];

    protected $casts = [
        'montant_min' => 'decimal:2',
        'montant_max' => 'decimal:2',
        'montant_par_echeance' => 'decimal:2',
        'nombre_echeances' => 'integer',
        'taux_interet' => 'decimal:2',
        'delai_retard_jours' => 'integer',
        'frais_retard_fixe' => 'decimal:2',
        'frais_retard_pourcentage' => 'decimal:2',
        'formulaire_dynamique' => 'json',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}
