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
    public function index(Request $request)
    {
        $query = ClientAddress::with('client');
        
        // Filtrar por client_id si se proporciona
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }
        
        return response()->json($query->get());
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

        return back()->with('success', 'Dirección agregada exitosamente');
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

        return back()->with('success', 'Dirección actualizada exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $clientAddress = ClientAddress::findOrFail($id);
        $clientAddress->delete();

        return back()->with('success', 'Dirección eliminada exitosamente');
    }
}
