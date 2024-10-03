<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\competencias;
use Illuminate\Http\Request;


class CompetenciasController extends Controller
{
    
    public function index()
    {  
       $competencia = competencias::all();
       return $competencia;
    }

    public function store(Request $request)
    { 
        $competencia = new competencias();
        $competencia->descripcion = $request->descripcion;
        $competencia->estado = $request->estado;

        $competencia->save();
    }
    
    public function show(string $id)
    {  
       $competencia = competencias::find($id);
       return $competencia;
    }
    
    public function update(Request $request, string $id)
    {
        $competencia = competencias::findOrFail($request ->id);
        $competencia->descripcion = $request ->descripcion;
        $competencia->estado = $request ->estado;

        $competencia->update();
        return $competencia;

    }

    public function destroy(string $id)
    {
        $competencia = competencias::destroy($id);
        return $competencia;
    }
}
