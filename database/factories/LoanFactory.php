<?php

namespace Database\Factories;

use App\Models\Loan;
use App\Models\LoanPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        $plan = LoanPlan::first() ?? LoanPlan::factory()->create();

        return [
            'user_id' => User::factory(),
            'loan_plan_id' => $plan->id,
            'montant' => fake()->randomFloat(2, $plan->montant_min, $plan->montant_max),
            'duree_mois' => $plan->nombre_echeances,
            'taux_interet' => $plan->taux_interet,
            'motif' => fake()->sentence(),
            'statut' => fake()->randomElement(['en_attente', 'approuve', 'rejete', 'solde', 'en_defaut']),
            'approuve_par' => null,
        ];
    }

    public function approuve(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'approuve',
            'approuve_par' => User::factory()->admin(),
        ]);
    }
}
