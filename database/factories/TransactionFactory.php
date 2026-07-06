<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'gateway_id' => null,
            'beneficiary_id' => null,
            'type' => fake()->randomElement(['depot', 'retrait', 'virement_interne', 'frais', 'interet']),
            'montant' => fake()->randomFloat(2, 10, 1000),
            'statut' => fake()->randomElement(['en_attente', 'reussie', 'echouee']),
            'reference' => 'TXN-' . strtoupper(Str::random(12)),
            'metadonnees' => null,
        ];
    }

    public function reussie(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'reussie',
        ]);
    }

    public function enAttente(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_attente',
        ]);
    }
}
