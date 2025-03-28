<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\MerchandiseEntry;
use Illuminate\Http\Request;

class DispatchController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $dispatches = Dispatch::with(['truck', 'merchandiseEntries'])->get();
    return response()->json($dispatches);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'truck_id' => 'required|exists:trucks,id',
            'merchandise_entries' => 'required|array',
            'merchandise_entries.*' => 'exists:merchandise_entries,id'
        ]);
    
        // Crear el despacho
        $dispatch = Dispatch::create([
            'date' => $validated['date'],
            'truck_id' => $validated['truck_id'],
        ]);
    
        // Asignar las entradas de mercadería al despacho
        MerchandiseEntry::whereIn('id', $validated['merchandise_entries'])
            ->update(['dispatch_id' => $dispatch->id, 'status' => 'Dispatched']);
    
        return response()->json([
            'message' => 'Dispatch created successfully',
            'dispatch' => $dispatch->load(['truck', 'merchandiseEntries']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Dispatch $dispatch)
    {
        return response()->json(
            $dispatch->load(['truck', 'merchandiseEntries.client', 'merchandiseEntries.supplier', 'merchandiseEntries.clientAddress'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dispatch $dispatch)
    {
        return response()->json(['message' => 'Updating a dispatch is not allowed'], 403);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dispatch $dispatch)
    {
        return response()->json(['message' => 'Deleting a dispatch is not allowed'], 403);
    }

    public function removeEntryFromDispatch(Request $request, $entryId)
    {
        $entry = MerchandiseEntry::findOrFail($entryId);

        if (!$entry->dispatch_id) {
            return response()->json(['message' => 'This entry is not assigned to any dispatch'], 400);
        }

        // Quitar el despacho y cambiar estado a "Pending"
        $entry->update([
            'dispatch_id' => null,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Entry removed from dispatch successfully',
            'merchandise_entry' => $entry
        ]);
    }

}
