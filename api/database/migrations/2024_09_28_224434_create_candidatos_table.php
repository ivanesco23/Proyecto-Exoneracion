<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidatos', function (Blueprint $table) {
            $table->id();
            $table->string('cedula');
            $table->string('nombre');
            $table->string('puesto_al_que_aspira');
            $table->string('departamento');
            $table->float('salario_al_que_aspira');
            $table->string('competencias');
            $table->string('capacitaciones');
            $table->string('idioma');
            $table->string('experiencia_laboral');
            $table->string('recomendado_por');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidatos');
    }
};
