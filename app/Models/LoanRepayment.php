<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanRepayment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'loan_id',
        'numero_echeance',
        'montant_du',
        'date_echeance',
        'statut',
        'penalite_retard',
    ];

    protected $casts = [
        'numero_echeance' => 'integer',
        'montant_du' => 'decimal:2',
        'date_echeance' => 'datetime',
        'penalite_retard' => 'decimal:2',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
