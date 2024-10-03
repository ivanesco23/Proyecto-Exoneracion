<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capacitaciones extends Model
{
    use HasFactory;
    protected $fillable = ['descripcion','nivel','fecha desde','fecha hasta','institucion'];
}
