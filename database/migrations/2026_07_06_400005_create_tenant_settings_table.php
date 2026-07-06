<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            
            // Transaction limits
            $table->decimal('daily_deposit_limit', 15, 2)->nullable();
            $table->decimal('daily_withdrawal_limit', 15, 2)->nullable();
            $table->decimal('daily_transfer_limit', 15, 2)->nullable();
            $table->decimal('single_transaction_limit', 15, 2)->nullable();
            
            // KYC settings
            $table->boolean('kyc_required_for_transactions')->default(true);
            $table->integer('kyc_verification_level')->default(1);
            
            // Fees
            $table->decimal('default_deposit_fee', 15, 2)->default(0.00);
            $table->decimal('default_withdrawal_fee', 15, 2)->default(0.00);
            $table->decimal('default_transfer_fee', 15, 2)->default(0.00);
            
            // Other settings
            $table->json('custom_settings')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_settings');
    }
};
