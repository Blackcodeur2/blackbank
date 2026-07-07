<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\AccountType;
use App\Models\Beneficiary;
use App\Models\KycDocument;
use App\Models\Loan;
use App\Models\LoanRepayment;
use App\Models\SavingsPlan;
use App\Models\SavingsPayment;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FullDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure a clean slate for demo data
        Schema::disableForeignKeyConstraints();

        // Truncate core tables used by demo (keep config-like tables intact)
        Beneficiary::truncate();
        Transaction::truncate();
        LoanRepayment::truncate();
        Loan::truncate();
        SavingsPayment::truncate();
        SavingsPlan::truncate();
        SupportTicketReply::truncate();
        SupportTicket::truncate();
        KycDocument::truncate();
        Account::truncate();
        AccountType::truncate();
        User::truncate();

        Schema::enableForeignKeyConstraints();

        $tenants = Tenant::all();
        if ($tenants->isEmpty()) {
            $this->command->error('No tenants found. Run TenantSeeder first.');
            return;
        }

        $accountTypeSets = [];
        foreach ($tenants as $tenant) {
            $accountTypeSets[$tenant->id] = [
                'personal' => AccountType::withoutTenantScope()->firstOrCreate(
                    [
                        'tenant_id' => $tenant->id,
                        'name' => 'Compte courant',
                    ],
                    [
                        'slug' => 'compte-courant-' . $tenant->id,
                        'description' => 'Compte courant standard',
                    ]
                ),
                'savings' => AccountType::withoutTenantScope()->firstOrCreate(
                    [
                        'tenant_id' => $tenant->id,
                        'name' => 'Epargne',
                    ],
                    [
                        'slug' => 'epargne-' . $tenant->id,
                        'description' => 'Compte d\'épargne',
                    ]
                ),
            ];
        }

        $personal = $accountTypeSets[$tenants->first()->id]['personal'];
        $savings = $accountTypeSets[$tenants->first()->id]['savings'];

        // Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@blackbank.test',
            'phone' => '+237600000001',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 10000000.00,
        ]);
        $superAdmin->assignRole('Super Admin');

        // Tenant / Bank admin
        $bankAdmin = User::create([
            'name' => 'Bank Admin',
            'email' => 'admin@blackbank.test',
            'phone' => '+237600000002',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 5000000.00,
        ]);
        $bankAdmin->assignRole('Tenant Admin');

        // Create demo clients with varied states
        $clients = [];

        $clients[] = User::create([
            'name' => 'Amina Traoré',
            'email' => 'amina@example.test',
            'phone' => '+237650000001',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 125000.00,
        ]);

        $clients[] = User::create([
            'name' => 'Blaise Kouassi',
            'email' => 'blaise@example.test',
            'phone' => '+237650000002',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'en_attente',
            'solde' => 0.00,
        ]);

        $clients[] = User::create([
            'name' => 'Chantal N.',
            'email' => 'chantal@example.test',
            'phone' => '+237650000003',
            'email_verified_at' => null,
            'password' => Hash::make('password'),
            'statut_kyc' => 'en_attente',
            'solde' => 25000.00,
        ]);

        $clients[] = User::create([
            'name' => 'David Okoro',
            'email' => 'david@example.test',
            'phone' => '+237650000004',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 750000.00,
        ]);

        foreach ($clients as $client) {
            $client->assignRole('Client');

            // Create accounts
            $account = Account::create([
                'user_id' => $client->id,
                'account_type_id' => $personal->id,
                'account_number' => 'ACC-' . strtoupper(Str::random(10)),
                'balance' => $client->solde,
                'currency' => 'XAF',
            ]);

            // Create a beneficiary for each client
            Beneficiary::create([
                'user_id' => $client->id,
                'nom' => $client->name,
                'numero_compte' => 'BEN-' . strtoupper(Str::random(8)),
                'libelle' => 'Bénéficiaire de ' . $client->name,
            ]);

            // Seed transactions
            Transaction::factory()->count(3)->create(['user_id' => $client->id]);

            // Seed savings plans
            SavingsPlan::factory()->count(1)->create(['user_id' => $client->id]);

            // Seed a loan for verified KYC clients
            if ($client->statut_kyc === 'verifie') {
                $loan = Loan::factory()->create(['user_id' => $client->id, 'statut' => 'approuve', 'approuve_par' => $bankAdmin->id]);
                // create repayments
                for ($i = 1; $i <= max(6, $loan->duree_mois ?: 6); $i++) {
                    $loan->repayments()->create([
                        'numero_echeance' => $i,
                        'montant_du' => round($loan->montant / ($loan->duree_mois ?: 6), 2),
                        'date_echeance' => now()->addMonths($i - 1),
                        'statut' => $i <= 2 ? 'payee' : 'en_attente',
                        'penalite_retard' => 0.00,
                    ]);
                }
            }

            // KYC documents for those verified
            if ($client->statut_kyc === 'verifie') {
                KycDocument::create([
                    'user_id' => $client->id,
                    'type_document' => 'identite',
                    'chemin_fichier' => 'seeders/identite.pdf',
                    'statut' => 'approuve',
                ]);
            }

            // Support ticket sample
            $ticket = SupportTicket::create([
                'user_id' => $client->id,
                'sujet' => 'Question sur mon compte',
                'message' => 'Je souhaite comprendre les frais appliqués',
                'statut' => 'ouvert',
            ]);

            SupportTicketReply::create([
                'ticket_id' => $ticket->id,
                'user_id' => $bankAdmin->id,
                'message' => 'Bonjour, nous regardons votre dossier et revenons vers vous.',
            ]);
        }

        // Create some global transactions between clients
        if (count($clients) >= 2) {
            Transaction::create([
                'user_id' => $clients[0]->id,
                'type' => 'virement_interne',
                'montant' => 15000.00,
                'statut' => 'reussie',
                'reference' => 'TFR-' . strtoupper(Str::random(10)),
                'metadonnees' => ['to' => $clients[1]->email],
            ]);
        }

        // Create demo employees for each Tenant (stations)
        $tenants = \App\Models\Tenant::all();
        foreach ($tenants as $tenant) {
            // two staff members per tenant
            for ($i = 1; $i <= 3; $i++) {
                $emp = User::create([
                    'name' => $tenant->name . ' - Agent ' . $i,
                    'email' => 'agent+' . $tenant->id . '+' . $i . '@' . ($tenant->slug ?? 'tenant') . '.com',
                    'phone' => '+2376' . rand(10000000, 99999999),
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'statut_kyc' => 'verifie',
                    'solde' => 0.00,
                    'tenant_id' => $tenant->id,
                    'role' => 'agent',
                ]);

                $emp->assignRole('Agent');

                // create a staff account
                Account::create([
                    'user_id' => $emp->id,
                    'account_type_id' => $accountTypeSets[$tenant->id]['personal']->id,
                    'account_number' => 'EMP-' . strtoupper(Str::random(8)),
                    'balance' => 0.00,
                    'currency' => $tenant->default_currency ?? 'XAF',
                ]);

                // create Staff record
                Staff::create([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $tenant->id,
                    'user_id' => $emp->id,
                    'name' => $emp->name,
                    'email' => $emp->email,
                    'phone' => $emp->phone,
                    'position' => 'Agent',
                    'status' => 'active',
                ]);
            }
        }

        $this->command->info('Full demo data seeded successfully (CFA - XAF).');
    }
}
