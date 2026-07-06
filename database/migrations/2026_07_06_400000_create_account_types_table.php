<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['current', 'savings', 'junior', 'business'])->default('current');
            $table->boolean('requires_kyc')->default(true);
            $table->boolean('allows_overdraft')->default(false);
            $table->decimal('overdraft_limit', 15, 2)->default(0.00);
            $table->decimal('minimum_balance', 15, 2)->default(0.00);
            $table->decimal('monthly_fee', 15, 2)->default(0.00);
            $table->json('features')->nullable();
            
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_types');
    }
};
