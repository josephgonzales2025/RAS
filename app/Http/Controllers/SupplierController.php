<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;

class SupplierController
{
    /**
     * Display a listing of the resource.
     */
    public function index() : JsonResponse
    {
        $suppliers = Supplier::orderBy('business_name', 'asc')->get();
        return new JsonResponse($suppliers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $supplier = Supplier::create($validated);

        return new JsonResponse($supplier, 201);
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
    public function update(UpdateSupplierRequest $request, Supplier $supplier) : JsonResponse
    {
        $validated = $request->validated();

        $supplier->update($validated);

        return new JsonResponse([
            'message' => 'Supplier updated successfully',
            'supplier' => $supplier
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier) : JsonResponse
    {
        $supplier->delete();

        return new JsonResponse([
            'message' => 'Supplier deleted successfully'
        ]);
    }
}
