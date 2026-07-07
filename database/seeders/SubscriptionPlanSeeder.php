<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        \App\Models\SubscriptionPlan::truncate();

        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Idéal pour les petites institutions financières',
                'price_monthly' => 49000.00,
                'price_yearly' => 490000.00,
                'max_clients' => 100,
                'max_staff' => 5,
                'features' => [
                    'Transactions illimitées',
                    'Gestion des comptes',
                    'Dépôts et retraits',
                    'Virements internes',
                    'Support email',
                ],
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Pour les institutions en croissance',
                'price_monthly' => 99000.00,
                'price_yearly' => 990000.00,
                'max_clients' => 500,
                'max_staff' => 20,
                'features' => [
                    'Tout du plan Starter',
                    'Virements externes',
                    'Produits d\'épargne (DPS/FDR)',
                    'Prêts et crédits',
                    'Système de parrainage',
                    'Support prioritaire',
                    'Rapports avancés',
                ],
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Pour les grandes institutions financières',
                'price_monthly' => 249000.00,
                'price_yearly' => 2490000.00,
                'max_clients' => null, // illimité
                'max_staff' => null, // illimité
                'features' => [
                    'Tout du plan Professional',
                    'Clients illimités',
                    'Staff illimité',
                    'API complète',
                    'Intégrations personnalisées',
                    'Cartes virtuelles',
                    'Multi-devises avancé',
                    'Support dédié 24/7',
                    'SLA garanti',
                ],
                'active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }

        $this->command->info('Subscription plans seeded successfully.');
    }
}
