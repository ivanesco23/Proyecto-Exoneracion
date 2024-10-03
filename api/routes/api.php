<?php

use App\Http\Controllers\CompetenciasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IdiomasController;
use App\Http\Controllers\CapaciatcionesController;
use App\Http\Controllers\PuestosController;
use App\Http\Controllers\CandidatosController;
use App\Http\Controllers\EmpleadosController;
use App\Http\Controllers\ExperienciasController;

Route::group(['middleware' => 'guest'], function () {
    Route::post('auth', 'AuthController@auth')->name('auth');
    Route::post('registrar_usuario', 'AuthController@registrar_usuario')->name('registrar_usuario');
});

//Route::group(['middleware' => 'auth'], function () {

    //Auth
    Route::get('logout', 'AuthController@logout')->name('logout');

    Route::controller(CompetenciasController::class)->group(function () {
        Route::get('/competencias', 'index');
        Route::post('/competencia', 'store');
        Route::get('/competencia/{id}', 'show');
        Route::put('/competencia/{id}', 'update');
        Route::delete('/competencia/{id}', 'destroy');
    });

    Route::controller(IdiomasController::class)->group(function () {
        Route::get('/idiomas', 'index');
        Route::post('/idioma', 'store');
        Route::get('/idioma/{id}', 'show');
        Route::put('/idioma/{id}', 'update');
        Route::delete('/idioma/{id}', 'destroy');
    });

    Route::controller(CapaciatcionesController::class)->group(function () {
        Route::get('/capacitaciones', 'index');
        Route::post('/capacitacion', 'store');
        Route::get('/capacitacion/{id}', 'show');
        Route::put('/capacitacion/{id}', 'update');
        Route::delete('/capacitacion/{id}', 'destroy');
    });

    Route::controller(PuestosController::class)->group(function () {
        Route::get('/puestos', 'index');
        Route::post('/puesto', 'store');
        Route::get('/puesto/{id}', 'show');
        Route::put('/puesto/{id}', 'update');
        Route::delete('/puesto/{id}', 'destroy');
    });

    Route::controller(CandidatosController::class)->group(function () {
        Route::get('/candidatos', 'index');
        Route::post('/candidato', 'store');
        Route::get('/candidato/{id}', 'show');
        Route::put('/candidato/{id}', 'update');
        Route::delete('/candidato/{id}', 'destroy');
        Route::post('/candidato/{id}/contratar', [CandidatosController::class, 'convertirEnEmpleado']);
    });

    Route::controller(EmpleadosController::class)->group(function () {
        Route::get('/empleados', 'index');
        Route::post('/empleado', 'store');
        Route::get('/empleado/{id}', 'show');
        Route::put('/empleado/{id}', 'update');
        Route::delete('/empleado/{id}', 'destroy');
    });

    Route::controller(ExperienciasController::class)->group(function () {
        Route::get('/experiencias', 'index');
        Route::post('/experiencia', 'store');
        Route::get('/experiencia/{id}', 'show');
        Route::put('/experiencia/{id}', 'update');
        Route::delete('/experiencia/{id}', 'destroy');
    });
//s});
