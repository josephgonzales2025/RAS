<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard de Entradas de Mercancía</h1>

    {{-- Resumen general --}}
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-white p-4 rounded shadow">
            <h2 class="text-lg font-bold">Peso Total</h2>
            <p id="dashboardTotalWeight" class="text-2xl font-bold text-blue-500">0 kg</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
            <h2 class="text-lg font-bold">Flete Total</h2>
            <p id="dashboardTotalFreight" class="text-2xl font-bold text-green-500">0</p>
        </div>
    </div>

    {{-- Filtro por zonas --}}
    <div class="mb-4">
        <label for="zoneFilter" class="block text-sm font-medium text-gray-700">Filtrar por Zona:</label>
        <select id="zoneFilter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Todas las Zonas</option>
            <option value="Tarapoto">Tarapoto</option>
            <option value="mama">mama</option>
            {{-- Agrega más opciones según las zonas disponibles --}}
        </select>
    </div>

    {{-- Tabla resumida --}}
    <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-bold mb-4">Entradas por Zona</h2>
        <table id="dashboardTable" class="w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border p-2">Zona</th>
                    <th class="border p-2">Peso Total</th>
                    <th class="border p-2">Flete Total</th>
                </tr>
            </thead>
            <tbody>
                {{-- Filas dinámicas cargadas desde la API --}}
            </tbody>
        </table>
    </div>
</div>