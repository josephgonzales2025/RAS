{{-- filepath: resources/views/partials/merchandise_entries.blade.php --}}
<h1 class="text-3xl font-bold mb-6 text-gray-800">Entradas de Mercancía</h1>

<div class="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-gray-700">Lista de Entradas</h2>
    <button id="openEntryModalBtn" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Agregar Entrada
    </button>
</div>

<!-- Modal para agregar entrada de mercancía -->
<div id="entryModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Agregar Entrada de Mercancía</h2>
            <button id="closeEntryModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="addMerchandiseEntryForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-2">
                    <label for="reception_date" class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Recepción:</label>
                    <input type="date" id="reception_date" name="reception_date" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" required>
                </div>
                <div class="mb-2">
                    <label for="guide_number" class="block text-sm font-semibold text-gray-700 mb-1">Número de Guía:</label>
                    <input type="text" id="guide_number" name="guide_number" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" required>
                </div>
                <div class="mb-2">
                    <label for="supplier_id" class="block text-sm font-semibold text-gray-700 mb-1">Proveedor:</label>
                    <select id="supplier_id" name="supplier_id" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" required>
                        {{-- Opciones dinámicas cargadas desde la API --}}
                    </select>
                </div>
                <div class="mb-2">
                    <label for="client_id" class="block text-sm font-semibold text-gray-700 mb-1">Cliente:</label>
                    <select id="client_id" name="client_id" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" required>
                        {{-- Opciones dinámicas cargadas desde la API --}}
                    </select>
                </div>
                <div class="mb-2">
                    <label for="client_address_id" class="block text-sm font-semibold text-gray-700 mb-1">Dirección del Cliente:</label>
                    <select id="client_address_id" name="client_address_id" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" required>
                        {{-- Opciones dinámicas cargadas desde la API --}}
                    </select>
                </div>
                <div class="mb-2">
                    <label for="total_weight" class="block text-sm font-semibold text-gray-700 mb-1">Peso Total (kg):</label>
                    <input type="number" id="total_weight" name="total_weight" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" step="0.01" required oninput="validateNumericInput(this)">
                </div>
                <div class="mb-2">
                    <label for="total_freight" class="block text-sm font-semibold text-gray-700 mb-1">Flete Total:</label>
                    <input type="number" id="total_freight" name="total_freight" class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" step="0.01" required oninput="validateNumericInput(this)">
                </div>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Guardar Entrada</button>
        </form>
    </div>
</div>

<div class="mb-4">
    <label for="filterMerchStatus">Filtrar por estado:</label>
    <select id="filterMerchStatus" class="border border-gray-300 rounded px-4 py-2" onchange="applyMerchandiseEntryFilter()">
        <option value="">Todos</option>
        <option value="disponible">Disponible</option>
        <option value="asignado">Asignado</option>
        <option value="despachado">Despachado</option>
    </select>
</div>

<!-- Acciones en lote para entradas de mercancía -->
<div id="bulkActionsContainer" class="bg-blue-100 border border-blue-300 rounded p-4 mb-4 hidden">
    <div class="flex items-center justify-between">
        <span id="selectedCount" class="text-blue-800">0 entradas seleccionadas</span>
        <div>
            <button id="unselectAllButton" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2" onclick="unselectAllMerchandiseEntries()">Deseleccionar todas</button>
            <button id="assignToDispatchButton" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onclick="openAssignToDispatchModal()">Asignar al despacho</button>
        </div>
    </div>
    <div class="overflow-x-auto"> <!-- Contenedor para hacer la tabla desplazable -->
        <table id="merchandiseEntriesTable" class="merchandise-entries-table w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border p-2 min-w-[50px]">Fecha de Recepción</th>
                    <th class="border p-2 min-w-[120px]">Número de Guía</th>
                    <th class="border p-2 min-w-[150px]">Proveedor</th>
                    <th class="border p-2 min-w-[150px]">Cliente</th>
                    <th class="border p-2 min-w-[80px]">Peso (kg)</th>
                    <th class="border p-2 min-w-[80px]">Flete</th>
                    <th class="border p-2 min-w-[80px]">Estado</th>
                    <th class="border p-2 min-w-[50px]">Seleccionar</th>
                    <th class="border p-2 min-w-[100px]">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se cargarán los datos desde la API -->
            </tbody>
        </table>
    </div>
</div>

<!-- Modal para Asignar al Despacho -->
<div id="assignToDispatchModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">Asignar Entradas al Despacho</h2>
        <form id="assignToDispatchForm">
            <div class="mb-4">
                <label for="dispatch_id" class="block text-sm font-medium text-gray-700">Seleccionar Despacho:</label>
                <select id="dispatch_id" name="dispatch_id" class="border border-gray-300 rounded px-4 py-2 w-full" required>
                    <!-- Opciones se cargarán dinámicamente -->
                </select>
            </div>
            <div class="flex justify-end">
                <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600" onclick="closeAssignToDispatchModal()">Cancelar</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Asignar</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para Agregar Productos a una Entrada -->
<div id="addProductModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">Agregar Producto</h2>
        <form id="addProductForm">
            <input type="hidden" id="productMerchandiseEntryId">
            <div class="mb-4">
                <label for="productDescription" class="block text-sm font-medium text-gray-700">Descripción del Producto:</label>
                <input type="text" id="productDescription" name="productDescription" class="border border-gray-300 rounded px-4 py-2 w-full" required>
            </div>
            <div class="mb-4">
                <label for="productQuantity" class="block text-sm font-medium text-gray-700">Cantidad:</label>
                <input type="number" id="productQuantity" name="productQuantity" class="border border-gray-300 rounded px-4 py-2 w-full" required min="1">
            </div>
            <div class="mb-4">
                <label for="productWeight" class="block text-sm font-medium text-gray-700">Peso (kg):</label>
                <input type="number" id="productWeight" name="productWeight" class="border border-gray-300 rounded px-4 py-2 w-full" required min="0" step="0.01">
            </div>
            <div class="flex justify-end">
                <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600" onclick="closeAddProductModal()">Cancelar</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar Producto</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para Ver Productos de una Entrada -->
<div id="viewProductsModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Productos de la Entrada</h2>
            <button class="text-gray-500 hover:text-gray-700" onclick="closeViewProductsModal()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="overflow-x-auto">
            <table id="productsTable" class="w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border p-2">Descripción</th>
                        <th class="border p-2">Cantidad</th>
                        <th class="border p-2">Peso (kg)</th>
                        <th class="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Se cargarán dinámicamente -->
                </tbody>
            </table>
        </div>
        <div class="flex justify-end mt-4">
            <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onclick="closeViewProductsModal()">Cerrar</button>
        </div>
    </div>
</div>
