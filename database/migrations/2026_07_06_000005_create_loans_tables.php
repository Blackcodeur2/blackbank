<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loan_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->decimal('montant_min', 15, 2);
            $table->decimal('montant_max', 15, 2);
            $table->decimal('montant_par_echeance', 15, 2)->nullable();
            $table->string('intervalle'); // e.g. monthly, weekly
            $table->integer('nombre_echeances');
            $table->decimal('taux_interet', 5, 2);
            $table->integer('delai_retard_jours')->default(0);
            $table->decimal('frais_retard_fixe', 15, 2)->default(0.00);
            $table->decimal('frais_retard_pourcentage', 5, 2)->default(0.00);
            $table->json('formulaire_dynamique')->nullable();
            $table->timestamps();
        });

        Schema::create('loans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('loan_plan_id')->constrained('loan_plans')->cascadeOnDelete();
            $table->decimal('montant', 15, 2);
            $table->integer('duree_mois');
            $table->decimal('taux_interet', 5, 2);
            $table->text('motif')->nullable();
            $table->enum('statut', ['en_attente', 'approuve', 'rejete', 'solde', 'en_defaut'])->default('en_attente');
            $table->uuid('approuve_par')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('loan_repayments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('loan_id')->constrained('loans')->cascadeOnDelete();
            $table->integer('numero_echeance');
            $table->decimal('montant_du', 15, 2);
            $table->timestamp('date_echeance');
            $table->enum('statut', ['en_attente', 'payee', 'en_retard'])->default('en_attente');
            $table->decimal('penalite_retard', 15, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_repayments');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('loan_plans');
    }
};
