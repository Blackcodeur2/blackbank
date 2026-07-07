<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\KycFormField;
use App\Models\PaymentGateway;
use App\Models\WithdrawalMethod;
use App\Models\LoanPlan;
use App\Models\Loan;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call new seeders first
        $this->call([
            TenantSeeder::class,
            CurrencySeeder::class,
            SubscriptionPlanSeeder::class,
            RolePermissionSeeder::class,
        ]);

        // 1. Create KYC Form Fields
        KycFormField::create([
            'libelle' => 'Pièce d’identité nationale (CNI/Passeport)',
            'type_champ' => 'fichier',
            'obligatoire' => true,
            'ordre' => 1,
        ]);
        KycFormField::create([
            'libelle' => 'Justificatif de domicile (Facture eau/électricité)',
            'type_champ' => 'fichier',
            'obligatoire' => true,
            'ordre' => 2,
        ]);
        KycFormField::create([
            'libelle' => 'Numéro d’identification fiscale',
            'type_champ' => 'texte',
            'obligatoire' => false,
            'ordre' => 3,
        ]);

        // 2. Create payment gateway (manual deposit)
        $manualGateway = PaymentGateway::create([
            'nom' => 'Dépôt bancaire direct',
            'type' => 'manual',
            'configuration' => [
                'instructions' => 'Veuillez virer les fonds sur notre compte BNP Paribas IBAN FR76... puis téléverser votre reçu de virement ci-dessous.',
                'champs_requis' => [
                    ['libelle' => 'Nom de la banque émettrice', 'type' => 'texte', 'obligatoire' => true],
                    ['libelle' => 'Numéro de référence du virement', 'type' => 'texte', 'obligatoire' => true],
                    ['libelle' => 'Reçu de virement (Image/PDF)', 'type' => 'fichier', 'obligatoire' => true],
                ]
            ],
            'actif' => true,
        ]);

        $manualGateway->currencies()->create([
            'devise' => 'EUR',
            'montant_min' => 10.00,
            'montant_max' => 10000.00,
            'frais_fixe' => 1.00,
            'frais_pourcentage' => 0.50,
            'taux_change' => 1.0000,
        ]);

        // 3. Create withdrawal method (manual withdrawal)
        WithdrawalMethod::create([
            'nom' => 'Virement bancaire classique',
            'devise' => 'EUR',
            'montant_min' => 50.00,
            'montant_max' => 5000.00,
            'frais_fixe' => 2.50,
            'frais_pourcentage' => 1.00,
            'instructions' => 'Les retraits par virement bancaire sont traités dans un délai de 24 à 48 heures ouvrables. Veuillez saisir vos coordonnées bancaires.',
            'formulaire_dynamique' => [
                ['libelle' => 'Nom du titulaire du compte', 'type' => 'texte', 'obligatoire' => true],
                ['libelle' => 'IBAN', 'type' => 'texte', 'obligatoire' => true],
                ['libelle' => 'Code BIC/SWIFT', 'type' => 'texte', 'obligatoire' => true],
            ],
            'actif' => true,
        ]);

        // 4. Create Loan Plans
        $planPersonnel = LoanPlan::create([
            'nom' => 'Prêt personnel Express',
            'montant_min' => 100.00,
            'montant_max' => 5000.00,
            'montant_par_echeance' => null,
            'intervalle' => 'monthly',
            'nombre_echeances' => 12,
            'taux_interet' => 5.50,
            'delai_retard_jours' => 5,
            'frais_retard_fixe' => 10.00,
            'frais_retard_pourcentage' => 1.50,
            'formulaire_dynamique' => [
                ['libelle' => 'Revenus mensuels (€)', 'type' => 'texte', 'obligatoire' => true],
                ['libelle' => 'Contrat de travail', 'type' => 'fichier', 'obligatoire' => true],
            ],
        ]);

        $planImmo = LoanPlan::create([
            'nom' => 'Crédit Immobilier Habitat',
            'montant_min' => 20000.00,
            'montant_max' => 250000.00,
            'montant_par_echeance' => null,
            'intervalle' => 'monthly',
            'nombre_echeances' => 120,
            'taux_interet' => 2.75,
            'delai_retard_jours' => 10,
            'frais_retard_fixe' => 50.00,
            'frais_retard_pourcentage' => 2.00,
            'formulaire_dynamique' => [
                ['libelle' => 'Apport personnel (€)', 'type' => 'texte', 'obligatoire' => true],
                ['libelle' => 'Compromis de vente', 'type' => 'fichier', 'obligatoire' => true],
                ['libelle' => '3 derniers bulletins de salaire', 'type' => 'fichier', 'obligatoire' => true],
            ],
        ]);

        // 5. Create Users
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@blackbank.com',
            'phone' => '+33600000001',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 100000.00,
        ]);
        $superAdmin->assignRole('Super Admin');

        $admin = User::create([
            'name' => 'Admin Bank',
            'email' => 'admin@blackbank.com',
            'phone' => '+33600000002',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 50000.00,
        ]);
        $admin->assignRole('Tenant Admin');

        $verifiedClient = User::create([
            'name' => 'Jean Dupont',
            'email' => 'client@blackbank.com',
            'phone' => '+33612345678',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'verifie',
            'solde' => 5230.50,
        ]);
        $verifiedClient->assignRole('Client');

        $unverifiedClient = User::create([
            'name' => 'Marie Martin',
            'email' => 'client2@blackbank.com',
            'phone' => '+33687654321',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'statut_kyc' => 'en_attente',
            'solde' => 0.00,
        ]);
        $unverifiedClient->assignRole('Client');

        // 6. Seed some transactions for Jean Dupont
        Transaction::create([
            'user_id' => $verifiedClient->id,
            'gateway_id' => $manualGateway->id,
            'type' => 'depot',
            'montant' => 5000.00,
            'statut' => 'reussie',
            'reference' => 'DEP-' . strtoupper(Str::random(10)),
            'metadonnees' => ['banque' => 'BNP Paribas', 'reference_virement' => 'VIR-JDU-001'],
        ]);

        Transaction::create([
            'user_id' => $verifiedClient->id,
            'type' => 'virement_interne',
            'montant' => 230.50,
            'statut' => 'reussie',
            'reference' => 'TFR-' . strtoupper(Str::random(10)),
            'metadonnees' => ['destinataire_email' => 'superadmin@blackbank.com', 'libelle' => 'Remboursement'],
        ]);

        // 7. Seed savings plan for Jean Dupont (FDR)
        SavingsPlan::create([
            'user_id' => $verifiedClient->id,
            'type_plan' => 'fdr',
            'montant' => 2000.00,
            'taux_interet' => 6.50,
            'date_debut' => now()->subMonths(3),
            'date_fin' => now()->addMonths(3),
            'statut' => 'actif',
            'penalite_retrait_anticipe' => 50.00,
            'intervalle_versement_interets' => 'once_on_maturity',
            'duree_blocage_jours' => 180,
        ]);

        // 8. Seed savings plan for Jean Dupont (DPS)
        $dps = SavingsPlan::create([
            'user_id' => $verifiedClient->id,
            'type_plan' => 'dps',
            'montant' => 100.00, // monthly installment
            'taux_interet' => 8.00,
            'date_debut' => now()->subMonths(2),
            'date_fin' => now()->addMonths(10),
            'statut' => 'actif',
            'intervalle_versement' => 'monthly',
            'nombre_echeances' => 12,
            'delai_retard_jours' => 5,
            'frais_retard_fixe' => 5.00,
            'frais_retard_pourcentage' => 1.00,
        ]);

        // Create payments for DPS
        $dps->payments()->create([
            'montant_du' => 100.00,
            'date_echeance' => now()->subMonths(2),
            'statut' => 'payee',
            'transaction_id' => Transaction::create([
                'user_id' => $verifiedClient->id,
                'type' => 'frais',
                'montant' => 100.00,
                'statut' => 'reussie',
                'reference' => 'DPS-' . strtoupper(Str::random(10)),
            ])->id,
        ]);

        $dps->payments()->create([
            'montant_du' => 100.00,
            'date_echeance' => now()->subMonth(),
            'statut' => 'payee',
            'transaction_id' => Transaction::create([
                'user_id' => $verifiedClient->id,
                'type' => 'frais',
                'montant' => 100.00,
                'statut' => 'reussie',
                'reference' => 'DPS-' . strtoupper(Str::random(10)),
            ])->id,
        ]);

        $dps->payments()->create([
            'montant_du' => 100.00,
            'date_echeance' => now()->addMonth(),
            'statut' => 'en_attente',
        ]);

        // 9. Seed loan for Jean Dupont
        $loan = Loan::create([
            'user_id' => $verifiedClient->id,
            'loan_plan_id' => $planPersonnel->id,
            'montant' => 1200.00,
            'duree_mois' => 12,
            'taux_interet' => 5.50,
            'motif' => 'Achat ordinateur de bureau',
            'statut' => 'approuve',
            'approuve_par' => $admin->id,
        ]);

        // Generate loan repayments
        for ($i = 1; $i <= 12; $i++) {
            $loan->repayments()->create([
                'numero_echeance' => $i,
                'montant_du' => 105.50, // 100 capital + 5.50 interest roughly
                'date_echeance' => now()->subMonths(3 - $i),
                'statut' => $i <= 2 ? 'payee' : 'en_attente',
                'penalite_retard' => 0.00,
            ]);
        }
    }
}
