<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Experiencias;

class ExperienciasController extends Controller
{
    
    public function index()
    {
        $experiencia = Experiencias::all();
       return $experiencia;
    }

    
    public function store(Request $request)
    {
        $experiencia = new Experiencias();
        $experiencia->empresa = $request->empresa;
        $experiencia->puesto_ocupado = $request->puesto_ocupado;
        $experiencia->fecha_desde = $request->fecha_desde;
        $experiencia->fecha_hasta = $request->fecha_hasta;
        $experiencia->salario = $request->salario;
        $experiencia->save();
    }

    
    public function show(string $id)
    {
        $experiencia = Experiencias::find($id);
       return $experiencia;
    }

    
    public function update(Request $request, string $id)
    {
        $experiencia = Experiencias::findOrFail($request -> id);
        $experiencia->empresa = $request->empresa;
        $experiencia->puesto_ocupado = $request->puesto_ocupado;
        $experiencia->fecha_desde = $request->fecha_desde;
        $experiencia->fecha_hasta = $request->fecha_hasta;
        $experiencia->salario = $request->salario;
        $experiencia->update();
        return $experiencia;
    }

    
    public function destroy(string $id)
    {
        $experiencia = Experiencias::destroy($id);
        return $experiencia;
    }
}
