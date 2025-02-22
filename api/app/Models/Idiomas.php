<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Idiomas extends Model
{
    use HasFactory;
    public function candidatos(){
        return $this->belongsToMany(Candidatos::class,'candidatos_idiomas');
    }}
