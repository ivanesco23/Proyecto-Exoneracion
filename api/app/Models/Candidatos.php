<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidatos extends Model
{
    use HasFactory;

    protected $fillable = [
        'cedula',
        'nombre',
        'puesto_al_que_aspira',
        'departamento',
        'salario_al_que_aspira',
        'competencias',
        'capacitaciones',
        'idioma',
        'experiencia_laboral',
        'recomendado_por',
        'puesto_id' // Agregar puesto_id al fillable
    ];

    public function puesto()
    {
        return $this->belongsTo(Puestos::class); // Relación con el modelo Puestos
    }

    public function competencias()
    {
        return $this->belongsToMany(Competencias::class, 'candidatos_competencias');
    }

    public function idiomas()
    {
        return $this->belongsToMany(Idiomas::class, 'candidatos_idiomas');
    }

    public function capacitaciones()
    {
        return $this->belongsToMany(Capacitaciones::class, 'candidatos_capacitaciones');
    }

    public function experiencias()
    {
        return $this->hasMany(Experiencias::class, 'candidatos_experiencias');
    }
}
