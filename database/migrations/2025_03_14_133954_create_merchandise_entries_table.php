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
        Schema::create('merchandise_entries', function (Blueprint $table) {
            $table->id();
            $table->date('reception_date');
            $table->string('guide_number')->unique();
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('client_address_id')->constrained('client_addresses');
            $table->decimal('total_weight', 10, 2);
            $table->decimal('total_freight', 10, 2);
            $table->enum('status', ['Pending', 'Dispatched'])->default('Pending');
            $table->foreignId('dispatch_id')->nullable()->constrained('dispatches')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchandise_entries');
    }
};
