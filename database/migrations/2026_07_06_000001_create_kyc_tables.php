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
        Schema::create('kyc_form_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('libelle');
            $table->enum('type_champ', ['texte', 'date', 'fichier', 'select']);
            $table->boolean('obligatoire')->default(true);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });

        Schema::create('kyc_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('type_document');
            $table->string('chemin_fichier');
            $table->enum('statut', ['en_attente', 'approuve', 'rejete'])->default('en_attente');
            $table->text('motif_rejet')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kyc_documents');
        Schema::dropIfExists('kyc_form_fields');
    }
};
