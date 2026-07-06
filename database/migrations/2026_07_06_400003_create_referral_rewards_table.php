<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_rewards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('referral_id')->constrained('referrals')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            
            $table->enum('reward_type', ['referrer', 'referred']);
            $table->decimal('amount', 15, 2);
            $table->string('currency')->default('XAF');
            $table->foreignUuid('transaction_id')->nullable()->constrained()->nullOnDelete();
            
            $table->enum('status', ['pending', 'credited', 'cancelled'])->default('pending');
            $table->timestamp('credited_at')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_rewards');
    }
};
