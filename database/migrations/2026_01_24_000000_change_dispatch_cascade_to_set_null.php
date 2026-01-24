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
            // Eliminar la foreign key existente con cascade
            $table->dropForeign(['dispatch_id']);
            
            // Recrear la foreign key con set null
            $table->foreign('dispatch_id')
                  ->references('id')
                  ->on('dispatches')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('merchandise_entries', function (Blueprint $table) {
            // Eliminar la foreign key con set null
            $table->dropForeign(['dispatch_id']);
            
            // Recrear la foreign key con cascade
            $table->foreign('dispatch_id')
                  ->references('id')
                  ->on('dispatches')
                  ->onDelete('cascade');
        });
    }
};
