<?php

namespace App\Http\Controllers;

use App\Models\MerchandiseEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MerchandiseEntryController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MerchandiseEntry::with(['supplier', 'client', 'clientAddress', 'products'])
            ->where('status', 'Pending');
        
        if ($request->has('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(guide_number) like ?', ["%{$search}%"])
                  ->orWhereHas('supplier', function($q) use ($search) {
                      $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"]);
                  })
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"]);
                  });
            });
        }
        
        $entries = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        
        return Inertia::render('MerchandiseEntries/Index', [
            'entries' => $entries,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Get entries for API calls (used by other components).
     */
    public function apiIndex(Request $request)
    {
        $query = MerchandiseEntry::with(['supplier', 'client', 'clientAddress', 'products'])
            ->where('status', 'Pending');
        
        if ($request->has('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(guide_number) like ?', ["%{$search}%"])
                  ->orWhereHas('supplier', function($q) use ($search) {
                      $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"]);
                  })
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"]);
                  });
            });
        }
        
        $entries = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        return response()->json($entries);
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'reception_date' => 'required|date|date_format:Y-m-d',
                'guide_number' => 'required|string|max:50',
                'supplier_id' => 'required|exists:suppliers,id',
                'client_id' => 'required|exists:clients,id',
                'client_address_id' => 'required|exists:client_addresses,id',
                'total_weight' => 'required|numeric|min:0',
                'total_freight' => 'required|numeric|min:0'
            ]);
    
            $entry = MerchandiseEntry::create($validated);
    
            return response()->json($entry, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MerchandiseEntry $merchandiseEntry)
    {
        return response()->json($merchandiseEntry);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MerchandiseEntry $merchandiseEntry)
    {
        $validated = $request->validate([
            'reception_date' => 'sometimes|date',
            'guide_number' => 'sometimes|string|max:50',
            'supplier_id' => 'sometimes|exists:suppliers,id',
            'client_id' => 'sometimes|exists:clients,id',
            'client_address_id' => 'sometimes|exists:client_addresses,id',
            'total_weight' => 'sometimes|numeric|min:0',
            'total_freight' => 'sometimes|numeric|min:0'
        ]);

        $merchandiseEntry->update($validated);
        $merchandiseEntry->save();

        return response()->json(['message' => 'Merchandise entry updated successfully', 'entry' => $merchandiseEntry]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MerchandiseEntry $merchandiseEntry)
    {
        $merchandiseEntry->delete();

        return response()->json(['message' => 'Merchandise entry deleted successfully']);
    }

    public function getZones()
    {
        try {
            // Realiza un join con la tabla client_addresses para obtener las zonas únicas
            $zones = MerchandiseEntry::join('client_addresses', 'merchandise_entries.client_address_id', '=', 'client_addresses.id')
                ->distinct()
                ->pluck('client_addresses.zone');
    
            // Devuelve las zonas como JSON
            return response()->json($zones);
        } catch (\Exception $e) {
            // Maneja cualquier error y devuelve un mensaje de error
            return response()->json(['error' => 'Error al obtener las zonas'], 500);
        }
    }
}
