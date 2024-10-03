<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Capacitaciones;
use Illuminate\Http\Request;

class CapaciatcionesController extends Controller
{
    
    public function index()
    {
        $capacitacion = Capacitaciones::all();
       return $capacitacion;
    }

    
    public function store(Request $request)
    {
        $capacitacion = new Capacitaciones();
        $capacitacion->descripcion = $request->descripcion;
        $capacitacion->nivel = $request->nivel;
        $capacitacion->fecha_desde = $request->fecha_desde;
        $capacitacion->fecha_hasta = $request->fecha_hasta;
        $capacitacion->institucion = $request->institucion;

        $capacitacion->save();
    }

    
    public function show(string $id)
    {
        $capacitacion = Capacitaciones::find($id);
       return $capacitacion;
    }

    
    public function update(Request $request, string $id)
    {   
        $capacitacion = Capacitaciones::findOrFail($request -> id);
        $capacitacion->descripcion = $request->descripcion;
        $capacitacion->nivel = $request->nivel;
        $capacitacion->fecha_desde = $request->fecha_desde;
        $capacitacion->fecha_hasta = $request->fecha_hasta;
        $capacitacion->institucion = $request->institucion;

        $capacitacion->update();
        return $capacitacion;
    }

    
    public function destroy(string $id)
    {
        $capacitacion = Capacitaciones::destroy($id);
        return $capacitacion;
    }
}
