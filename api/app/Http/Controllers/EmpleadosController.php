<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Empleados;
use Illuminate\Http\Request;

class EmpleadosController extends Controller
{
    
    public function index()
    {
        $empleado = Empleados::all();
       return $empleado;
    }

    
    public function store(Request $request)
    {
        $empleado = new Empleados();
        $empleado->cedula = $request->cedula;
        $empleado->nombre = $request->nombre;
        $empleado->fecha_ingreso = $request->fecha_ingreso;
        $empleado->departamento = $request->departamento;
        $empleado->puesto = $request->puesto;
        $empleado->salario_mensual = $request->salario_mensual;
        $empleado->estado = $request->estado;
        
        $empleado->save();
    }

    
    public function show(string $id)
    {
        $empleado = Empleados::find($id);
       return $empleado;
    }
    

    
    public function update(Request $request, string $id)
    {
        $empleado = Empleados::findOrFail($request -> id);
        $empleado->cedula = $request->cedula;
        $empleado->nombre = $request->nombre;
        $empleado->fecha_ingreso = $request->fecha_ingreso;
        $empleado->departamento = $request->departamento;
        $empleado->puesto = $request->puesto;
        $empleado->salario_mensual = $request->salario_mensual;
        $empleado->estado = $request->estado;

        $empleado->update();
        return $empleado;
    }

    
    public function destroy(string $id)
    {
        $empleado = Empleados::destroy($id);
        return $empleado;
    }
}
