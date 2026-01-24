<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) : Response
    {
        $query = Supplier::query();
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('ruc_dni', 'like', "%{$search}%")
                  ->orWhere('business_name', 'like', "%{$search}%");
            });
        }
        
        $suppliers = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Display a listing of the resource for API.
     */
    public function apiIndex(Request $request) : JsonResponse
    {
        $query = Supplier::query();
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('ruc_dni', 'like', "%{$search}%")
                  ->orWhere('business_name', 'like', "%{$search}%");
            });
        }
        
        $suppliers = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
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
