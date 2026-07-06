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
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('type'); // e.g. automatic, manual
            $table->text('configuration'); // encrypted json configuration
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        Schema::create('gateway_currencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('gateway_id')->constrained('payment_gateways')->cascadeOnDelete();
            $table->string('devise');
            $table->decimal('montant_min', 15, 2);
            $table->decimal('montant_max', 15, 2);
            $table->decimal('frais_fixe', 15, 2)->default(0.00);
            $table->decimal('frais_pourcentage', 5, 2)->default(0.00);
            $table->decimal('taux_change', 15, 4)->default(1.0000);
            $table->timestamps();
        });

        Schema::create('withdrawal_methods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('devise');
            $table->decimal('montant_min', 15, 2);
            $table->decimal('montant_max', 15, 2);
            $table->decimal('frais_fixe', 15, 2)->default(0.00);
            $table->decimal('frais_pourcentage', 5, 2)->default(0.00);
            $table->text('instructions');
            $table->json('formulaire_dynamique')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdrawal_methods');
        Schema::dropIfExists('gateway_currencies');
        Schema::dropIfExists('payment_gateways');
    }
};
