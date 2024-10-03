<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleados extends Model
{
    use HasFactory;

    protected $fillable = [
        'cedula',
        'nombre',
        'departamento',
        'fecha_ingreso',
        'puesto',
        'salario_mensual',
        'estado',
    ];
}

