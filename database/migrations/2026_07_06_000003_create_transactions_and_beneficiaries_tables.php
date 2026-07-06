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
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->string('numero_compte');
            $table->string('libelle')->nullable();
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('gateway_id')->nullable()->index();
            $table->uuid('beneficiary_id')->nullable()->index();
            $table->enum('type', ['depot', 'retrait', 'virement_interne', 'virement_externe', 'virement_telegraphique', 'frais', 'interet']);
            $table->decimal('montant', 15, 2);
            $table->enum('statut', ['en_attente', 'reussie', 'echouee', 'annulee'])->default('en_attente');
            $table->string('reference')->unique();
            $table->json('metadonnees')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('beneficiaries');
    }
};
