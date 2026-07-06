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
        Schema::create('savings_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type_plan', ['dps', 'fdr']);
            $table->decimal('montant', 15, 2);
            $table->decimal('taux_interet', 5, 2);
            $table->timestamp('date_debut');
            $table->timestamp('date_fin');
            $table->enum('statut', ['actif', 'cloture', 'rompu_anticipe'])->default('actif');
            $table->decimal('penalite_retrait_anticipe', 15, 2)->nullable();

            // DPS specific fields
            $table->string('intervalle_versement')->nullable();
            $table->integer('nombre_echeances')->nullable();
            $table->integer('delai_retard_jours')->nullable();
            $table->decimal('frais_retard_fixe', 15, 2)->nullable();
            $table->decimal('frais_retard_pourcentage', 5, 2)->nullable();

            // FDR specific fields
            $table->string('intervalle_versement_interets')->nullable();
            $table->integer('duree_blocage_jours')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('savings_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('savings_plan_id')->constrained('savings_plans')->cascadeOnDelete();
            $table->decimal('montant_du', 15, 2);
            $table->timestamp('date_echeance');
            $table->enum('statut', ['en_attente', 'payee', 'en_retard'])->default('en_attente');
            $table->uuid('transaction_id')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_payments');
        Schema::dropIfExists('savings_plans');
    }
};
