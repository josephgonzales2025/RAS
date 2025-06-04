<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

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
    public function store(StoreClientRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $client = Client::create($validated);

        return new JsonResponse([
            'message' => 'Client created successfully',
            'client' => $client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) : JsonResponse
    {
        $client = Client::find($id);
        if($client.isEmpty()){
            return new JsonResponse(['message' => 'Client not found']);
        }
        $client->load('addresses');
        return new JsonResponse($client);
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
