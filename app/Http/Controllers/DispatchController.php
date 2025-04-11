<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\MerchandiseEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DispatchController
{
    /**
     * Muestra la lista de despachos.
     */
    public function index()
    {
        $dispatches = Dispatch::with('merchandiseEntries')->get();
        return response()->json($dispatches);
    }

    /**
     * Crea un nuevo despacho.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dispatch_date' => 'required|date',
            'driver_name' => 'required|string|max:255',
            'driver_license' => 'required|string|max:255',
            'transport_company_name' => 'required|string|max:255',
            'transport_company_ruc' => 'required|string|max:20',
        ]);

        $dispatch = Dispatch::create($validated);

        return response()->json(['message' => 'Despacho creado con éxito', 'dispatch' => $dispatch], 201);
    }

    public function show(Dispatch $dispatch)
    {
        if (!$dispatch) {
            return response()->json(['error' => 'Despacho no encontrado'], 404);
        }

        // Carga el despacho con los registros asignados y sus relaciones
        $dispatch->load(['merchandiseEntries.client', 'merchandiseEntries.supplier', 'merchandiseEntries.clientAddress']);
        return response()->json($dispatch);
    }

    /**
     * Asigna una entrada de mercancía a un despacho.
     */
    public function assignMerchandiseEntry(Request $request, Dispatch $dispatch)
    {
        $validated = $request->validate([
            'merchandise_entry_id' => 'required|exists:merchandise_entries,id',
        ]);

        $merchandiseEntry = MerchandiseEntry::findOrFail($validated['merchandise_entry_id']);
        // Actualiza el estado del registro a "Despachado"
        $merchandiseEntry->update(['status' => 'Dispatched']);

        // Asigna el registro al despacho
        $dispatch->merchandiseEntries()->save($merchandiseEntry);

        return response()->json(['message' => 'Entrada de mercancía asignada con éxito', 'merchandiseEntry' => $merchandiseEntry]);
    }

    /**
     * Elimina una entrada de mercancía de un despacho.
     */
    public function removeMerchandiseEntry(Dispatch $dispatch, MerchandiseEntry $merchandiseEntry)
    {
        DB::beginTransaction(); // Inicia transacción explícita para PostgreSQL

        try {
            // Verifica relación (con carga eager para eficiencia)
            if ($merchandiseEntry->dispatch_id !== $dispatch->id) {
                return response()->json([
                    'message' => 'La entrada de mercancía no pertenece a este despacho'
                ], 400);
            }

            // Actualiza con condiciones atómicas
            $updated = $merchandiseEntry->update([
                'dispatch_id' => null,
                'status' => 'Pending', // ¡Asegúrate que coincida exactamente con el ENUM!
            ]);

            if (!$updated) {
                throw new \Exception("No se pudo actualizar la entrada de mercancía");
            }

            DB::commit(); // Confirma cambios si todo va bien

            return response()->json([
                'message' => 'Entrada de mercancía eliminada del despacho con éxito',
                'merchandiseEntry' => $merchandiseEntry->fresh(), // Devuelve datos actualizados
            ]);

        } catch (\Exception $e) {
            DB::rollBack(); // Revierte cambios en caso de error
            
            return response()->json([
                'message' => 'Error al desvincular la entrada de mercancía',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDispatchTotals(Request $request, $dispatchId)
    {
        try {
            $query = MerchandiseEntry::where('dispatch_id', $dispatchId);

            if ($request->has('client_id') && $request->client_id) {
                $query->where('client_id', $request->client_id);
            }

            $totals = $query->selectRaw('SUM(total_weight) as total_weight, SUM(total_freight) as total_freight')->first();

            return response()->json([
                'total_weight' => $totals->total_weight ?? 0,
                'total_freight' => $totals->total_freight ?? 0,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los totales'], 500);
        }
    }

    public function getDispatchClients($dispatchId)
    {
        try {
            $clients = MerchandiseEntry::where('dispatch_id', $dispatchId)
                ->join('clients', 'merchandise_entries.client_id', '=', 'clients.id')
                ->distinct()
                ->get(['clients.id as client_id', 'clients.business_name']);

            return response()->json($clients);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los clientes'], 500);
        }
    }

    public function assignBulk(Request $request, Dispatch $dispatch)
    {
        $validated = $request->validate([
            'merchandise_entry_ids' => 'required|array',
            'merchandise_entry_ids.*' => 'exists:merchandise_entries,id',
        ]);

        // Asignar las entradas al despacho
        MerchandiseEntry::whereIn('id', $validated['merchandise_entry_ids'])->update([
            'dispatch_id' => $dispatch->id,
            'status' => 'Dispatched', // Actualiza el estado a 'dispatched'
        ]);

        return response()->json(['message' => 'Registros asignados con éxito.']);
    }
    
}
