<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Candidatos;
use App\Models\Empleados;
use Illuminate\Http\Request;

class CandidatosController extends Controller
{
    // Obtener todos los candidatos
    public function index()
    {
        $candidato = Candidatos::all();
        return $candidato;
    }

    // Almacenar un nuevo candidato
    public function store(Request $request)
    {

        $candidato = new Candidatos();
        $candidato->cedula = $request->cedula;
        $candidato->nombre = $request->nombre;
        $candidato->puesto_al_que_aspira = $request->puesto_al_que_aspira;
        $candidato->departamento = $request->departamento;
        $candidato->salario_al_que_aspira = $request->salario_al_que_aspira;
        $candidato->competencias = $request->competencias;
        $candidato->capacitaciones = $request->capacitaciones;
        $candidato->idioma = $request->idioma;
        $candidato->experiencia_laboral = $request->experiencia_laboral;
        $candidato->recomendado_por = $request->recomendado_por;
        
        $candidato->save();
    }

    // Mostrar un candidato específico
    public function show(string $id)
    {
        $candidato = Candidatos::find($id);
        return $candidato;
    }

    // Actualizar un candidato existente
    public function update(Request $request, string $id)
    {
        $candidato = Candidatos::findOrFail($id);
        $candidato->cedula = $request->cedula;
        $candidato->nombre = $request->nombre;
        $candidato->puesto_al_que_aspira = $request->puesto_al_que_aspira;
        $candidato->departamento = $request->departamento;
        $candidato->salario_al_que_aspira = $request->salario_al_que_aspira;
        $candidato->competencias = $request->competencias;
        $candidato->capacitaciones = $request->capacitaciones;
        $candidato->idioma = $request->idioma;
        $candidato->experiencia_laboral = $request->experiencia_laboral;
        $candidato->recomendado_por = $request->recomendado_por;
        $candidato->update();
        return $candidato;
    }

    // Eliminar un candidato
    public function destroy(string $id)
    {
        $candidato = Candidatos::destroy($id);
        return $candidato;
    }

    // Nueva función para convertir un candidato en empleado
    public function convertirEnEmpleado($id, Request $request)
    {
        // Buscar el candidato por ID
        $candidato = Candidatos::find($id);

        if (!$candidato) {
            return response()->json(['message' => 'Candidato no encontrado'], 404);
        }

        // Validar los datos recibidos para el nuevo empleado
        $request->validate([
            'fecha_ingreso' => 'required|date',
            'salario_mensual' => 'required|numeric',
            'puesto' => 'required|numeric',  // Debe ser el ID del puesto
            'departamento' => 'required|string', // Validar que el departamento esté presente
        ]);

        // Crear un nuevo empleado con los datos del candidato
        $empleado = new Empleados();
        $empleado->cedula = $candidato->cedula;
        $empleado->nombre = $candidato->nombre;
        $empleado->departamento = $request->input('departamento');
        $empleado->fecha_ingreso = $request->input('fecha_ingreso');
        $empleado->puesto = $request->input('puesto');  // Asignar el ID del puesto
        $empleado->salario_mensual = $request->input('salario_mensual');
        $empleado->estado = 1; // Activo por defecto

        // Guardar el nuevo empleado
        $empleado->save();

        // Eliminar el candidato de la tabla de candidatos
        $candidato->delete();

        return response()->json(['message' => 'Candidato convertido en empleado con éxito'], 200);
    }
}
