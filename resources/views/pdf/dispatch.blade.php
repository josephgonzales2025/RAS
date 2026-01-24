<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Despacho #{{ $dispatch->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
        }
        .info-section {
            margin-bottom: 15px;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .info-row {
            display: flex;
        }
        .info-label {
            font-weight: bold;
            margin-right: 8px;
        }
        .zone-header {
            background-color: #2563eb;
            color: white;
            padding: 8px;
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th {
            background-color: #e5e7eb;
            padding: 6px;
            text-align: left;
            border: 1px solid #d1d5db;
            font-size: 9px;
        }
        td {
            padding: 6px;
            border: 1px solid #d1d5db;
            font-size: 9px;
        }
        .zone-subtotal {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .grand-total {
            background-color: #dbeafe;
            font-weight: bold;
            font-size: 10px;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 8px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DESPACHO #{{ $dispatch->id }}</h1>
        <p style="margin: 5px 0;">Fecha de impresión: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Fecha del Despacho:</span>
            <span>{{ \Carbon\Carbon::parse($dispatch->dispatch_date)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Chofer:</span>
            <span>{{ $dispatch->driver_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Brevete:</span>
            <span>{{ $dispatch->driver_license }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Empresa de Transporte:</span>
            <span>{{ $dispatch->transport_company_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">RUC:</span>
            <span>{{ $dispatch->transport_company_ruc }}</span>
        </div>
    </div>

    @foreach($entriesByZone as $zone => $entries)
        <div class="zone-header">
            ZONA: {{ strtoupper($zone) }}
        </div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 8%;">N° Guía</th>
                    <th style="width: 25%;">Proveedor</th>
                    <th style="width: 25%;">Cliente</th>
                    <th style="width: 22%;">Dirección</th>
                    <th style="width: 10%;" class="text-right">Peso (kg)</th>
                    <th style="width: 10%;" class="text-right">Flete (S/)</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $zoneTotalWeight = 0;
                    $zoneTotalFreight = 0;
                @endphp
                @foreach($entries as $entry)
                    @php
                        $zoneTotalWeight += $entry->total_weight;
                        $zoneTotalFreight += $entry->total_freight;
                    @endphp
                    <tr>
                        <td>{{ $entry->guide_number }}</td>
                        <td>{{ $entry->supplier->business_name ?? 'N/A' }}</td>
                        <td>{{ $entry->client->business_name ?? 'N/A' }}</td>
                        <td>{{ $entry->clientAddress->address ?? 'N/A' }}</td>
                        <td class="text-right">{{ number_format($entry->total_weight, 2) }}</td>
                        <td class="text-right">{{ number_format($entry->total_freight, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="zone-subtotal">
                    <td colspan="4" class="text-right">SUBTOTAL {{ strtoupper($zone) }}:</td>
                    <td class="text-right">{{ number_format($zoneTotalWeight, 2) }}</td>
                    <td class="text-right">{{ number_format($zoneTotalFreight, 2) }}</td>
                </tr>
            </tbody>
        </table>
    @endforeach

    <table style="margin-top: 15px;">
        <tr class="grand-total">
            <td colspan="4" class="text-right" style="padding: 10px;">TOTAL GENERAL:</td>
            <td class="text-right" style="padding: 10px;">{{ number_format($totalWeight, 2) }} kg</td>
            <td class="text-right" style="padding: 10px;">S/ {{ number_format($totalFreight, 2) }}</td>
        </tr>
    </table>

    <div class="footer">
        <p>Total de entradas: {{ $totalEntries }} | Zonas: {{ count($entriesByZone) }}</p>
        <p>Documento generado automáticamente - RAS Sistema de Gestión</p>
    </div>
</body>
</html>
