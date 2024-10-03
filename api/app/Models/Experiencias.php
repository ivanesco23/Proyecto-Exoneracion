<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experiencias extends Model
{
    use HasFactory;

    protected $fillable = [
        'empresa',
        'puesto_ocupado',
        'fecha_desde',
        'fecha_hasta',
        'salario',
        'candidato_id',
        
    ];
}


