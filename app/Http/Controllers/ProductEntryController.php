<?php

namespace App\Http\Controllers;

use App\Models\ProductEntry;
use Illuminate\Http\Request;

class ProductEntryController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(ProductEntry::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'merchandise_entry_id' => 'required|exists:merchandise_entries,id',
            'product_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'type' => 'nullable|string|max:100',
        ]);
    
        $productEntry = ProductEntry::create($validated);
    
        return response()->json(['message' => 'Product added successfully', 'productEntry' => $productEntry], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($merchandiseEntryId)
    {
        $products = ProductEntry::where('merchandise_entry_id', $merchandiseEntryId)->get();

        return response()->json($products);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductEntry $productEntry)
    {
        $validated = $request->validate([
            'merchandise_entry_id' => 'sometimes|exists:merchandise_entries,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:1',
            'type' => 'sometimes|string|max:100'
        ]);

        $productEntry->update($validated);

        return response()->json(['message' => 'Product entry updated successfully', 'productEntry' => $productEntry]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductEntry $productEntry)
    {
        try {
            $productEntry->delete();
    
            return response()->json(['message' => 'Producto eliminado con éxito.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el producto.', 'error' => $e->getMessage()], 500);
        }
    }
}
