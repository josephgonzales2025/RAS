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
        Schema::table('merchandise_entries', function (Blueprint $table) {
            // Eliminar el índice único (requiere el nombre del índice)
            $table->dropUnique(['guide_number']);

            // Opcional: Si quieres mantenerlo como string sin restricción
            $table->string('guide_number')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('merchandise_entries', function (Blueprint $table) {
            // Para revertir: volver a hacerlo único
            $table->string('guide_number')->unique()->change();
        });
    }
};
