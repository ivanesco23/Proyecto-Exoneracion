<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('capacitaciones', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->string('nivel');
            $table->date('fecha_desde');
            $table->date('fecha_hasta');
            $table->string('institucion');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('capacitaciones');
    }
};
