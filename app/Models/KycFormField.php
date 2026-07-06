<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycFormField extends Model
{
    use HasFactory, HasUuids;

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
