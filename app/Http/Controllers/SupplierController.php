<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Supplier::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ruc_dni' => 'required|string|max:11|unique:suppliers',
            'business_name' => 'required|string|max:255',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'ruc_dni' => 'sometimes|required|string|max:11|unique:suppliers,ruc_dni,' . $supplier->id,
            'business_name' => 'sometimes|required|string|max:255',
        ]);

        $supplier->update($validated);

        return response()->json(['message' => 'Supplier updated successfully', 'supplier' => $supplier]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
