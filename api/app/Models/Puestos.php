<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Puestos extends Model
{
    use HasFactory;
    protected $fillable = ['nombre','nivel_de_riesgo','departamento','salario_minimo','salario_maximo','estado'];

    
}
