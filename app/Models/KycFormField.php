<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycFormField extends Model
{
    use HasFactory, HasUuids, BelongsToTenant;

    protected $fillable = [
        'libelle',
        'type_champ',
        'obligatoire',
        'ordre',
    ];

    protected $casts = [
        'obligatoire' => 'boolean',
        'ordre' => 'integer',
    ];
}
