<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingsPayment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'savings_plan_id',
        'montant_du',
        'date_echeance',
        'statut',
        'transaction_id',
    ];

    protected $casts = [
        'montant_du' => 'decimal:2',
        'date_echeance' => 'datetime',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SavingsPlan::class, 'savings_plan_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
