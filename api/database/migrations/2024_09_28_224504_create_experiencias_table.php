<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiencias', function (Blueprint $table) {
            $table->id();
            $table->string('empresa');
            $table->string('puesto_ocupado'); // Cambiar a string si almacenas nombres de puestos
            $table->date('fecha_desde');
            $table->date('fecha_hasta')->nullable(); // Permitir NULL en fecha_hasta
            $table->decimal('salario', 10, 2); // Mejor usar decimal para valores monetarios
        
            // Define candidato_id como unsignedBigInteger
            $table->unsignedBigInteger('candidato_id')->nullable();
            $table->foreign('candidato_id')
                  ->references('id')
                  ->on('candidatos')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();
        
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiencias');
    }
};

