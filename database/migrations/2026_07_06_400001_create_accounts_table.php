<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_type_id')->constrained('account_types')->cascadeOnDelete();
            
            $table->string('account_number')->unique();
            $table->string('iban')->nullable();
            $table->string('currency')->default('XAF');
            $table->decimal('balance', 15, 2)->default(0.00);
            $table->decimal('frozen_balance', 15, 2)->default(0.00);
            
            $table->enum('status', ['active', 'frozen', 'closed'])->default('active');
            $table->timestamp('closed_at')->nullable();
            $table->text('closure_reason')->nullable();
            
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'currency']);
            $table->index('account_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
