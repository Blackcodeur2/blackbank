<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Stancl\Tenancy\Database\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        Domain::truncate();
        \App\Models\Tenant::truncate();

        // Create demo tenants
        $tenants = [
            [
                'id' => 'demo_bank',
                'name' => 'Demo Bank Cameroon',
                'slug' => 'demo-bank',
                'email' => 'contact@demobank.cm',
                'phone' => '+237 233 123 456',
                'address' => 'Yaoundé, Cameroun',
                'logo' => null,
                'primary_color' => '#3b82f6',
                'secondary_color' => '#1e40af',
                'default_currency' => 'XAF',
                'timezone' => 'Africa/Douala',
                'status' => 'active',
            ],
            [
                'id' => 'micro_finance',
                'name' => 'MicroFinance Plus',
                'slug' => 'microfinance',
                'email' => 'info@microfinance.cm',
                'phone' => '+237 699 987 654',
                'address' => 'Douala, Cameroun',
                'logo' => null,
                'primary_color' => '#10b981',
                'secondary_color' => '#065f46',
                'default_currency' => 'XAF',
                'timezone' => 'Africa/Douala',
                'status' => 'active',
            ],
            [
                'id' => 'coop_epargne',
                'name' => 'Coopérative d\'Épargne',
                'slug' => 'coop-epargne',
                'email' => 'contact@coopepargne.cm',
                'phone' => '+237 677 111 222',
                'address' => 'Bafoussam, Cameroun',
                'logo' => null,
                'primary_color' => '#f59e0b',
                'secondary_color' => '#92400e',
                'default_currency' => 'XAF',
                'timezone' => 'Africa/Douala',
                'status' => 'active',
            ],
        ];

        foreach ($tenants as $tenantData) {
            $id = $tenantData['id'];
            $slug = $tenantData['slug'];
            $name = $tenantData['name'];
            
            // Remove id, name and slug from data (they go in separate columns)
            unset($tenantData['id'], $tenantData['name'], $tenantData['slug']);
            
            $tenant = \App\Models\Tenant::create([
                'id' => $id,
                'name' => $name,
                'data' => $tenantData,
            ]);
            
            // Create domain for each tenant
            Domain::create([
                'domain' => $slug . '.localhost',
                'tenant_id' => $tenant->id,
            ]);
        }

        $this->command->info('Tenants seeded successfully.');
    }
}
