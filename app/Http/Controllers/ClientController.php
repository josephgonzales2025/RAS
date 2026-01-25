<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::with('addresses');
        
        if ($request->has('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"]);
            });
        }
        
        $clients = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Display a listing of the resource for API.
     */
    public function apiIndex(Request $request)
    {
        $query = Client::with('addresses');
        
        if ($request->has('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(business_name) like ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(ruc_dni) like ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"]);
            });
        }
        
        $clients = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        return response()->json($clients);
    }

    /**
     * Get all clients without pagination (for selects).
     */
    public function allClients()
    {
        $clients = Client::orderBy('business_name', 'asc')->get();
        return response()->json($clients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'ruc' => 'required|string|max:20|unique:clients,ruc_dni',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
        ]);

        // Mapear ruc a ruc_dni para guardar en la BD
        $data = $validated;
        $data['ruc_dni'] = $validated['ruc'];
        unset($data['ruc']);

        $client = Client::create($data);

        // Si es una petición AJAX/API, devolver JSON
        if ($request->expectsJson()) {
            return response()->json($client, 201);
        }

        return redirect()->route('clients.index')
            ->with('success', 'Cliente creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load('addresses');
        
        // Si es una petición AJAX/API, devolver JSON
        if (request()->expectsJson()) {
            return response()->json($client);
        }
        
        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        $client->load('addresses');
        
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'ruc' => 'required|string|max:20|unique:clients,ruc_dni,' . $client->id,
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
        ]);

        // Mapear ruc a ruc_dni para actualizar en la BD
        $data = $validated;
        $data['ruc_dni'] = $validated['ruc'];
        unset($data['ruc']);

        $client->update($data);

        // Si es una petición AJAX/API, devolver JSON
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Cliente actualizado exitosamente',
                'client' => $client
            ]);
        }

        return redirect()->route('clients.index')
            ->with('success', 'Cliente actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        try {
            $client->delete();
            
            // Si es una petición AJAX/API, devolver JSON
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Cliente eliminado exitosamente'
                ]);
            }
            
            return redirect()->route('clients.index')
                ->with('success', 'Cliente eliminado exitosamente');
        } catch (\Exception $e) {
            // Si es una petición AJAX/API, devolver error JSON
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Error al eliminar el cliente: ' . $e->getMessage()
                ], 500);
            }
            
            return redirect()->route('clients.index')
                ->with('error', 'Error al eliminar el cliente: ' . $e->getMessage());
        }
    }
}