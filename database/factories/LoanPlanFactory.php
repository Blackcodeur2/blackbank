<?php

namespace Database\Factories;

use App\Models\LoanPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanPlanFactory extends Factory
{
    protected $model = LoanPlan::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->randomElement(['Prêt personnel', 'Prêt immobilier', 'Prêt auto', 'Crédit d’études']),
            'montant_min' => fake()->randomFloat(2, 500, 1000),
            'montant_max' => fake()->randomFloat(2, 5000, 50000),
            'montant_par_echeance' => null,
            'intervalle' => 'monthly',
            'nombre_echeances' => fake()->randomElement([6, 12, 24, 36]),
            'taux_interet' => fake()->randomFloat(2, 3, 15),
            'delai_retard_jours' => 5,
            'frais_retard_fixe' => 15.00,
            'frais_retard_pourcentage' => 3.00,
            'formulaire_dynamique' => [
                [
                    'libelle' => 'Justificatif de revenu',
                    'type_champ' => 'fichier',
                    'obligatoire' => true
                ],
                [
                    'libelle' => 'Profession',
                    'type_champ' => 'texte',
                    'obligatoire' => true
                ]
            ],
        ];
    }
}
