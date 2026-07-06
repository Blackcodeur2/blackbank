<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 3)->unique();
            $table->string('name');
            $table->string('symbol');
            $table->integer('decimal_places')->default(2);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('from_currency_id')->constrained('currencies')->cascadeOnDelete();
            $table->foreignUuid('to_currency_id')->constrained('currencies')->cascadeOnDelete();
            
            $table->decimal('rate', 15, 8);
            $table->timestamp('effective_date');
            $table->boolean('is_default')->default(false);
            
            $table->timestamps();
            
            $table->unique(['from_currency_id', 'to_currency_id', 'effective_date'], 'exchange_rates_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchange_rates');
        Schema::dropIfExists('currencies');
    }
};
