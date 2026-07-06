<?php

namespace Database\Factories;

use App\Models\SavingsPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SavingsPlanFactory extends Factory
{
    protected $model = SavingsPlan::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['dps', 'fdr']);
        $montant = $type === 'dps' ? fake()->randomFloat(2, 50, 500) : fake()->randomFloat(2, 1000, 10000);
        $dateDebut = now();
        $dateFin = $type === 'dps' ? now()->addMonths(12) : now()->addMonths(6);

        return [
            'user_id' => User::factory(),
            'type_plan' => $type,
            'montant' => $montant,
            'taux_interet' => fake()->randomFloat(2, 5, 12),
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'statut' => 'actif',
            'penalite_retrait_anticipe' => fake()->randomFloat(2, 10, 50),

            // DPS specific fields
            'intervalle_versement' => $type === 'dps' ? 'monthly' : null,
            'nombre_echeances' => $type === 'dps' ? 12 : null,
            'delai_retard_jours' => $type === 'dps' ? 5 : null,
            'frais_retard_fixe' => $type === 'dps' ? 10.00 : null,
            'frais_retard_pourcentage' => $type === 'dps' ? 2.00 : null,

            // FDR specific fields
            'intervalle_versement_interets' => $type === 'fdr' ? 'once_on_maturity' : null,
            'duree_blocage_jours' => $type === 'fdr' ? 180 : null,
        ];
    }

    public function dps(): static
    {
        return $this->state(fn (array $attributes) => [
            'type_plan' => 'dps',
            'montant' => fake()->randomFloat(2, 50, 500),
            'intervalle_versement' => 'monthly',
            'nombre_echeances' => 12,
            'delai_retard_jours' => 5,
            'frais_retard_fixe' => 10.00,
            'frais_retard_pourcentage' => 2.00,
            'intervalle_versement_interets' => null,
            'duree_blocage_jours' => null,
        ]);
    }

    public function fdr(): static
    {
        return $this->state(fn (array $attributes) => [
            'type_plan' => 'fdr',
            'montant' => fake()->randomFloat(2, 1000, 10000),
            'intervalle_versement' => null,
            'nombre_echeances' => null,
            'delai_retard_jours' => null,
            'frais_retard_fixe' => null,
            'frais_retard_pourcentage' => null,
            'intervalle_versement_interets' => 'once_on_maturity',
            'duree_blocage_jours' => 180,
        ]);
    }
}
