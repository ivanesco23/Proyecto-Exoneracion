<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::group(['middleware' => 'guest'], function () {
    Route::post('auth', 'AuthController@auth')->name('auth');
    Route::get('login', 'AuthController@login')->name('login');
    Route::get('registrarme', 'AuthController@registrar')->name('registrarme');
    Route::post('registrar_usuario', 'AuthController@store')->name('registrar_usuario');
    
});

Route::group(['middleware' => 'auth'], function () {
    //Auth
    Route::get('logout', 'AuthController@logout')->name('logout');
    
    //Inicio
    Route::get('/', 'PuestoController@listado_general')->name('/');

    //Candidato
    Route::resource('candidato', 'CandidatoController');
    Route::get('candidatos/{id}', 'CandidatoController@listado_candidatos')->name('candidatos');
    Route::get('postularme/{id_puesto}', 'CandidatoController@postularme')->name('postularme');
    Route::get('procesar_candidato/{candidato}/{estatus}', 'CandidatoController@procesar_candidato')->name('procesar_candidato');

    //Idioma
    Route::resource('idioma', 'IdiomaController');

    //Competencia
    Route::resource('competencia', 'CompetenciaController');

    //Departamento
    Route::resource('departamento', 'DepartamentoController');

    //Puesto
    Route::resource('puesto', 'PuestoController');
    Route::get('mis_postulaciones', 'PuestoController@mis_postulaciones')->name('mis_postulaciones');

    //Empleado
    Route::resource('empleado', 'EmpleadoController');
});
