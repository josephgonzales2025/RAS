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
            $table->foreignId('dispatch_id')->nullable()->constrained('dispatches')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('merchandise_entries', function (Blueprint $table) {
            $table->dropForeign(['dispatch_id']);
            $table->dropColumn('dispatch_id');
        });
    }
};
