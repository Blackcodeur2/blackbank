<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@blackbank.com'],
            [
                'name' => 'Super Admin',
                'phone' => '+237600000000',
                'password' => Hash::make('password'),
                'statut_kyc' => 'verifie',
                'solde' => 0,
                'role' => 'super_admin',
                'deux_facteurs_actif' => false,
            ]
        );

        $admin->assignRole('Super Admin');

        $this->command->info('Admin user created/updated successfully.');
        $this->command->info('Email: admin@blackbank.com');
        $this->command->info('Password: password');
    }
}
