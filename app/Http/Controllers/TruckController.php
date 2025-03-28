<?php

namespace App\Http\Controllers;

use App\Models\Truck;
use Illuminate\Http\Request;

class TruckController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Truck::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:20|unique:trucks,plate_number',
            'model' => 'required|string|max:100',
            'capacity' => 'required|numeric|min:0',
        ]);

        $truck = Truck::create($validated);

        return response()->json(['message' => 'Truck created successfully', 'truck' => $truck], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Truck $truck)
    {
        return response()->json($truck);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Truck $truck)
    {
        $validated = $request->validate([
            'plate_number' => 'sometimes|required|string|max:20|unique:trucks,plate_number,' . $truck->id,
            'model' => 'sometimes|required|string|max:100',
            'capacity' => 'sometimes|required|numeric|min:0',
        ]);

        $truck->update($validated);

        return response()->json(['message' => 'Truck updated successfully', 'truck' => $truck]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Truck $truck)
    {
        $truck->delete();

        return response()->json(['message' => 'Truck deleted successfully']);
    }
}
