<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\MerchandiseEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener datos de los últimos 12 meses
        $monthlyStats = $this->getMonthlyStats();
        
        // Obtener datos de entradas pendientes
        $pendingStats = $this->getPendingStats();
        
        // Obtener datos agrupados por zona
        $zoneStats = $this->getZoneStats();
        
        return Inertia::render('Dashboard', [
            'monthlyStats' => $monthlyStats,
            'pendingStats' => $pendingStats,
            'zoneStats' => $zoneStats,
        ]);
    }

    private function getMonthlyStats()
    {
        // Obtener fecha de inicio (últimos 12 meses)
        $startDate = Carbon::now()->subMonths(11)->startOfMonth();
        
        // Detectar el driver de base de datos
        $driver = DB::connection()->getDriverName();
        
        // Usar la función correcta según el driver
        if ($driver === 'pgsql') {
            $dateFormat = "TO_CHAR(dispatches.dispatch_date, 'YYYY-MM')";
        } else {
            $dateFormat = "DATE_FORMAT(dispatches.dispatch_date, '%Y-%m')";
        }
        
        // Obtener las entradas de mercancía que han sido despachadas (tienen dispatch_id)
        $stats = MerchandiseEntry::select(
            DB::raw("$dateFormat as month"),
            DB::raw('SUM(merchandise_entries.total_weight) as total_weight'),
            DB::raw('SUM(merchandise_entries.total_freight) as total_freight')
        )
        ->join('dispatches', 'merchandise_entries.dispatch_id', '=', 'dispatches.id')
        ->where('dispatches.dispatch_date', '>=', $startDate)
        ->whereNotNull('merchandise_entries.dispatch_id')
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->get();

        // Crear un array con todos los meses del rango
        $allMonths = [];
        $currentDate = $startDate->copy();
        $endDate = Carbon::now()->endOfMonth();
        
        while ($currentDate <= $endDate) {
            $monthKey = $currentDate->format('Y-m');
            $allMonths[$monthKey] = [
                'month' => $monthKey,
                'month_label' => $currentDate->locale('es')->isoFormat('MMM YYYY'),
                'total_weight' => 0,
                'total_freight' => 0,
            ];
            $currentDate->addMonth();
        }

        // Llenar con los datos reales
        foreach ($stats as $stat) {
            if (isset($allMonths[$stat->month])) {
                $allMonths[$stat->month]['total_weight'] = (float) $stat->total_weight;
                $allMonths[$stat->month]['total_freight'] = (float) $stat->total_freight;
            }
        }

        return array_values($allMonths);
    }

    private function getPendingStats()
    {
        // Obtener el total de peso y flete de entradas pendientes (sin despachar)
        $pendingEntries = MerchandiseEntry::whereNull('dispatch_id')
            ->where('status', 'Pending')
            ->selectRaw('
                SUM(total_weight) as total_weight,
                SUM(total_freight) as total_freight,
                COUNT(*) as total_entries
            ')
            ->first();

        return [
            'total_weight' => (float) ($pendingEntries->total_weight ?? 0),
            'total_freight' => (float) ($pendingEntries->total_freight ?? 0),
            'total_entries' => (int) ($pendingEntries->total_entries ?? 0),
        ];
    }

    private function getZoneStats()
    {
        // Obtener el total de peso y flete de entradas pendientes agrupadas por zona
        $zoneStats = MerchandiseEntry::select(
            'client_addresses.zone',
            DB::raw('SUM(merchandise_entries.total_weight) as total_weight'),
            DB::raw('SUM(merchandise_entries.total_freight) as total_freight'),
            DB::raw('COUNT(merchandise_entries.id) as total_entries')
        )
        ->join('client_addresses', 'merchandise_entries.client_address_id', '=', 'client_addresses.id')
        ->whereNull('merchandise_entries.dispatch_id')
        ->where('merchandise_entries.status', 'Pending')
        ->groupBy('client_addresses.zone')
        ->orderBy('total_weight', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'zone' => $item->zone,
                'total_weight' => (float) $item->total_weight,
                'total_freight' => (float) $item->total_freight,
                'total_entries' => (int) $item->total_entries,
            ];
        });

        return $zoneStats;
    }
}
