<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'account_type_id',
        'account_number',
        'iban',
        'currency',
        'balance',
        'frozen_balance',
        'status',
        'closed_at',
        'closure_reason',
        'metadata',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'frozen_balance' => 'decimal:2',
        'closed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accountType(): BelongsTo
    {
        return $this->belongsTo(AccountType::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency', 'code');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function availableBalance(): float
    {
        return $this->balance - $this->frozen_balance;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
