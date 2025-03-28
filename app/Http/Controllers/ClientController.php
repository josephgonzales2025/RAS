<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Client::with('addresses')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ruc_dni' => 'required|string|unique:clients,ruc_dni',
            'business_name' => 'required|string|max:255',
        ]);

        $client = Client::create($request->only(['ruc_dni', 'business_name']));

        return response()->json($client, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return $client->load('addresses');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $request->validate([
            'ruc_dni' => 'sometimes|string|unique:clients,ruc_dni,' . $client->id,
            'business_name' => 'sometimes|string|max:255',
        ]);

        $client->update($request->only(['ruc_dni', 'business_name']));

        return response()->json($client);
    }
}
