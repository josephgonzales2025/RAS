<?php

namespace App\Http\Controllers;

use App\Models\MerchandiseEntry;
use Illuminate\Http\Request;

class MerchandiseEntryController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $entries = MerchandiseEntry::where('status', 'Pending')->with(['supplier', 'client', 'clientAddress'])->get();
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
                'guide_number' => 'required|string|max:50|unique:merchandise_entries,guide_number',
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
            'reception_date' => 'sometimes|required|date',
            'guide_number' => 'sometimes|required|string|max:50|unique:merchandise_entries,guide_number,' . $merchandiseEntry->id,
            'supplier_id' => 'sometimes|required|exists:suppliers,id',
            'client_id' => 'sometimes|required|exists:clients,id',
            'address_id' => 'sometimes|required|exists:client_addresses,id',
            'total_weight' => 'sometimes|required|numeric|min:0',
            'total_freight' => 'sometimes|required|numeric|min:0',
            'dispatch_id' => 'sometimes|required|exists:dispatches,id',
        ]);

        $merchandiseEntry->update($validated);

        // ✅ Asegurar que el estado cambie automáticamente
        if ($merchandiseEntry->dispatch_id) {
            $merchandiseEntry->status = 'Dispatched';
        } else {
            $merchandiseEntry->status = 'Pending';
        }

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


}
