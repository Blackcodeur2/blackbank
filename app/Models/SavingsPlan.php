<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SavingsPlan extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'type_plan',
        'montant',
        'taux_interet',
        'date_debut',
        'date_fin',
        'statut',
        'penalite_retrait_anticipe',
        'intervalle_versement',
        'nombre_echeances',
        'delai_retard_jours',
        'frais_retard_fixe',
        'frais_retard_pourcentage',
        'intervalle_versement_interets',
        'duree_blocage_jours',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'taux_interet' => 'decimal:2',
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'penalite_retrait_anticipe' => 'decimal:2',
        'nombre_echeances' => 'integer',
        'delai_retard_jours' => 'integer',
        'frais_retard_fixe' => 'decimal:2',
        'frais_retard_pourcentage' => 'decimal:2',
        'duree_blocage_jours' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SavingsPayment::class);
    }
}
