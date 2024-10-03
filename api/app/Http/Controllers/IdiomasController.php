<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Idiomas;

class IdiomasController extends Controller
{
    
    public function index()
    {
        $idioma = Idiomas::all();
        return $idioma;
    }

    
    public function store(Request $request)
    {
        $idioma = new Idiomas();
        $idioma->nombre = $request->nombre;
        $idioma->estado = $request->estado;

        $idioma->save();
    }

    
    public function show(string $id)
    {
        $idioma = Idiomas::find($id);
        return $idioma;
    }

    
    public function update(Request $request, string $id)
    {
        $idioma = Idiomas::findOrFail($request ->id);
        $idioma->nombre = $request ->nombre;
        $idioma->estado = $request ->estado;
        $idioma->update();
        return $idioma;
    }

   
    public function destroy(string $id)
    {
        $idioma = Idiomas::destroy($id);
        return $idioma;
    }
}
