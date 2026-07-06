<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'loan_plan_id',
        'montant',
        'duree_mois',
        'taux_interet',
        'motif',
        'statut',
        'approuve_par',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'duree_mois' => 'integer',
        'taux_interet' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(LoanPlan::class, 'loan_plan_id');
    }

    public function repayments(): HasMany
    {
        return $this->hasMany(LoanRepayment::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approuve_par');
    }
}
