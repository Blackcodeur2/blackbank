<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\LoanPlan;
use App\Models\Loan;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BankingTest extends TestCase
{
    use RefreshDatabase;

    protected User $verifiedUser;
    protected User $unverifiedUser;
    protected User $adminUser;
    protected LoanPlan $loanPlan;

    protected function setUp(): void
    {
        parent::setUp();

        // Create loan plan
        $this->loanPlan = LoanPlan::create([
            'nom' => 'Prêt personnel Test',
            'montant_min' => 100.00,
            'montant_max' => 5000.00,
            'intervalle' => 'monthly',
            'nombre_echeances' => 12,
            'taux_interet' => 6.00,
            'delai_retard_jours' => 5,
            'frais_retard_fixe' => 10.00,
            'frais_retard_pourcentage' => 1.00,
        ]);

        // Create verified user
        $this->verifiedUser = User::create([
            'name' => 'Verified Client',
            'email' => 'verified@blackbank.com',
            'phone' => '+33611111111',
            'password' => bcrypt('password'),
            'statut_kyc' => 'verifie',
            'solde' => 1000.00,
            'role' => 'client',
        ]);

        // Create unverified user
        $this->unverifiedUser = User::create([
            'name' => 'Unverified Client',
            'email' => 'unverified@blackbank.com',
            'phone' => '+33622222222',
            'password' => bcrypt('password'),
            'statut_kyc' => 'non_soumis',
            'solde' => 1000.00,
            'role' => 'client',
        ]);

        // Create admin user
        $this->adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@blackbank.com',
            'phone' => '+33633333333',
            'password' => bcrypt('password'),
            'statut_kyc' => 'verifie',
            'solde' => 5000.00,
            'role' => 'admin',
        ]);
    }

    /**
     * Test that unverified users are blocked by EnsureKycVerified middleware.
     */
    public function test_unverified_users_cannot_perform_financial_actions()
    {
        $this->actingAs($this->unverifiedUser);

        // Try transfer
        $response = $this->post(route('transactions.transfer'), [
            'email_destinataire' => 'verified@blackbank.com',
            'montant' => 100.00,
        ]);
        $response->assertRedirect(route('kyc.index'));

        // Try savings subscription
        $response = $this->post(route('savings.subscribe'), [
            'type' => 'DPS',
            'montant' => 200.00,
            'duree_mois' => 12,
        ]);
        $response->assertRedirect(route('kyc.index'));

        // Try loan application
        $response = $this->post(route('loans.apply'), [
            'loan_plan_id' => $this->loanPlan->id,
            'montant' => 500.00,
            'duree_mois' => 12,
        ]);
        $response->assertRedirect(route('kyc.index'));
    }

    /**
     * Test that verified users can perform transfers.
     */
    public function test_verified_users_can_transfer_funds()
    {
        $this->actingAs($this->verifiedUser);

        $response = $this->post(route('transactions.transfer'), [
            'email_destinataire' => $this->unverifiedUser->email,
            'montant' => 200.00,
            'description' => 'Test transfer',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals(800.00, $this->verifiedUser->fresh()->solde);
        $this->assertEquals(1200.00, $this->unverifiedUser->fresh()->solde);

        // Assert sender and recipient transaction records exist
        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->verifiedUser->id,
            'type' => 'virement_interne',
            'montant' => 200.00,
            'statut' => 'reussie',
        ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->unverifiedUser->id,
            'type' => 'virement_interne',
            'montant' => 200.00,
            'statut' => 'reussie',
        ]);
    }

    /**
     * Test savings plan subscription and balance deduction.
     */
    public function test_verified_users_can_subscribe_to_savings_plan()
    {
        $this->actingAs($this->verifiedUser);

        $response = $this->post(route('savings.subscribe'), [
            'type' => 'FDR',
            'montant' => 300.00,
            'duree_mois' => 12,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals(700.00, $this->verifiedUser->fresh()->solde);

        $this->assertDatabaseHas('savings_plans', [
            'user_id' => $this->verifiedUser->id,
            'type_plan' => 'fdr',
            'montant' => 300.00,
            'taux_interet' => 7.50,
            'statut' => 'actif',
        ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->verifiedUser->id,
            'type' => 'virement_interne',
            'montant' => 300.00,
            'statut' => 'reussie',
        ]);
    }

    /**
     * Test loan application submission and admin approval schedule generation.
     */
    public function test_loan_application_and_approval_workflow()
    {
        $this->actingAs($this->verifiedUser);

        // Apply for loan
        $response = $this->post(route('loans.apply'), [
            'loan_plan_id' => $this->loanPlan->id,
            'montant' => 1000.00,
            'duree_mois' => 12,
            'motif' => 'Need money for computer',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('loans', [
            'user_id' => $this->verifiedUser->id,
            'loan_plan_id' => $this->loanPlan->id,
            'montant' => 1000.00,
            'statut' => 'en_attente',
        ]);

        $loan = Loan::where('user_id', $this->verifiedUser->id)->first();

        // Approve loan acting as Admin
        $this->actingAs($this->adminUser);

        $response = $this->post(route('admin.loans.approve', $loan));
        $response->assertSessionHasNoErrors();

        // Client balance should be credited with the loan principal
        $this->assertEquals(2000.00, $this->verifiedUser->fresh()->solde);

        // Loan status should be active
        $this->assertEquals('actif', $loan->fresh()->statut);

        // Repayments schedule should be generated
        // Interest = 1000 * 0.06 * (12/12) = 60
        // Total = 1060
        // Monthly payment = 1060 / 12 = 88.33
        $this->assertEquals(12, $loan->repayments()->count());
        $this->assertEquals(88.33, $loan->repayments()->first()->montant_du);
    }
}
