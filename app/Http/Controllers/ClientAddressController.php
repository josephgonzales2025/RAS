<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientAddress;
use Illuminate\Http\Request;

class ClientAddressController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(ClientAddress::with('client')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'address' => 'required|string|max:255',
            'zone' => 'required|string|max:100',
        ]);

        $clientAddress = ClientAddress::create($validated);

        return response()->json([
            'message' => 'Address created successfully', 
            'address' => $clientAddress
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Obtiene todas las direcciones asociadas al cliente con el ID proporcionado
        $clientAddresses = ClientAddress::where('client_id', $id)->get();

        // Verifica si hay direcciones asociadas
        if ($clientAddresses->isEmpty()) {
            return response()->json(['message' => 'No hay direcciones disponibles para este cliente.'], 200);
        }

        // Devuelve las direcciones en formato JSON
        return response()->json($clientAddresses, 200);
        }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'address' => 'sometimes|required|string|max:255',
            'zone' => 'sometimes|required|string|max:100',
        ]);
        $clientAddress = ClientAddress::findOrFail($id);
        $clientAddress->update($validated);

        return response()->json($clientAddress);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $clientAddress = ClientAddress::findOrFail($id);
        $clientAddress->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
