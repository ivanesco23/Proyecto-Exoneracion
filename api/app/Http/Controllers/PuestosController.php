<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Puestos;
use Illuminate\Http\Request;

class PuestosController extends Controller
{
    
    public function index()
    {
        $puesto = Puestos::all();
       return $puesto;
    }

   
    public function store(Request $request)
    {
        $puesto = new Puestos();
        $puesto->nombre = $request->nombre;
        $puesto->departamento = $request->departamento;
        $puesto->nivel_de_riesgo = $request->nivel_de_riesgo; // Cambiado a nivel_de_riesgo
        $puesto->salario_minimo = $request->salario_minimo; // Cambiado a salario_minimo
        $puesto->salario_maximo = $request->salario_maximo; // Cambiado a salario_maximo
        $puesto->estado = $request->estado;

        $puesto->save();
    }

    
    public function show(string $id)
    {
        $puesto = Puestos::find($id);
        return $puesto;
    }

   
    public function update(Request $request, string $id)
    {
        $puesto = Puestos::findOrFail($request -> id);
        $puesto->nombre = $request->nombre;
        $puesto->departamento = $request->departamento;
        $puesto->nivel_de_riesgo = $request->nivel_de_riesgo; 
        $puesto->salario_minimo = $request->salario_minimo; 
        $puesto->salario_maximo = $request->salario_maximo; 
        $puesto->estado = $request->estado;
        
        $puesto->update();
        return $puesto;
    }

   
    public function destroy(string $id)
    {
        $puesto = Puestos::destroy($id);
        return $puesto;
    }
}
