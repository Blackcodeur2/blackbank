<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('referred_user_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('referral_code')->unique();
            $table->integer('total_referrals')->default(0);
            $table->decimal('total_rewards', 15, 2)->default(0.00);
            
            $table->timestamp('referred_at')->nullable();
            $table->boolean('is_completed')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
