<div class="container mx-auto mt-8">

    <!-- Título de la vista -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Despachos</h1>

    <div class="bg-white shadow-md rounded p-6 mb-6">
        <form id="createDispatchForm">
            <div class="grid grid-cols-2 gap-6">
                <div class="mb-4">
                    <label for="dispatch_date" class="block text-sm font-medium text-gray-700">Fecha del Despacho:</label>
                    <input type="date" id="dispatch_date" name="dispatch_date" class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2 bg-gray-50" required>
                </div>
                <div class="mb-4">
                    <label for="driver_name" class="block text-sm font-medium text-gray-700">Nombre del Chofer:</label>
                    <input type="text" id="driver_name" name="driver_name" class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2 bg-gray-50" required>
                </div>
                <div class="mb-4">
                    <label for="driver_license" class="block text-sm font-medium text-gray-700">Brevete del Chofer:</label>
                    <input type="text" id="driver_license" name="driver_license" class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2 bg-gray-50" required>
                </div>
                <div class="mb-4">
                    <label for="transport_company_name" class="block text-sm font-medium text-gray-700">Nombre de la Empresa de Transporte:</label>
                    <input type="text" id="transport_company_name" name="transport_company_name" class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2 bg-gray-50" required>
                </div>
                <div class="mb-4">
                    <label for="transport_company_ruc" class="block text-sm font-medium text-gray-700">RUC de la Empresa de Transporte:</label>
                    <input type="text" id="transport_company_ruc" name="transport_company_ruc" class="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-2 bg-gray-50" oninput="validateRucDni(this)" required>
                </div>
            </div>
            <button type="submit" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Crear Despacho</button>
        </form>
    </div>

    <!-- Tabla para listar los despachos -->
    <div class="bg-white shadow-md rounded p-4">
        <h2 class="text-xl font-semibold mb-4">Lista de Despachos</h2>
        <table class="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">ID</th>
                    <th class="border border-gray-300 px-4 py-2">Fecha del Despacho</th>
                    <th class="border border-gray-300 px-4 py-2">Chofer</th>
                    <th class="border border-gray-300 px-4 py-2">Empresa de Transporte</th>
                    <th class="border border-gray-300 px-4 py-2">RUC</th>
                    <th class="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody id="dispatchTableBody">
                <!-- Aquí se cargarán los despachos dinámicamente -->
            </tbody>
        </table>
    </div>
</div>

<!-- Modal para asignar registros -->
<div id="assignModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-lg w-3/4 p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Asignar Registros al Despacho</h2>
            <button onclick="closeAssignModal()" class="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow">
                <span class="text-lg font-bold">&times;</span>
            </button>
        </div>
        <div class="mb-4">
            <label for="merchandiseEntrySelect" class="block text-sm font-medium text-gray-700">Seleccionar Número de Guía</label>
            <select id="merchandiseEntrySelect" class="mt-1 block border p-2 w-full">
                <!-- Opciones cargadas dinámicamente -->
            </select>
        </div>
        <button onclick="assignMerchandiseEntry()" class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">Asignar</button>
        <hr class="my-4">
        <div class="mb-4">
            <label for="searchInput" class="block text-sm font-medium text-gray-700">Buscar:</label>
            <input
                type="text"
                id="searchInput"
                class="border border-gray-300 rounded px-4 py-2 w-full"
                placeholder="Escribe el nombre del cliente o proveedor..."
                oninput="filterTable()"
            />
        </div>
        <h3 class="text-lg font-semibold mb-2">Registros Asignados</h3>
        
        <!-- AQUI va el scroll -->
        <div class="overflow-y-auto max-h-96 border border-gray-300 rounded">
            <table class="min-w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2 min-w-[80px]">Fecha de Recepción</th>
                        <th class="border border-gray-300 px-4 py-2">Número de Guía</th>
                        <th class="border border-gray-300 px-4 py-2 min-w-[200px]">Proveedor</th>
                        <th class="border border-gray-300 px-4 py-2 min-w-[350px]">Cliente</th>
                        <th class="border border-gray-300 px-4 py-2 min-w-[150px]">Zona</th>
                        <th class="border border-gray-300 px-4 py-2 min-w-[130px]">Peso Total</th>
                        <th class="border border-gray-300 px-4 py-2">Flete Total</th>
                        <th class="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody id="assignedEntriesTableBody">
                    <!-- Registros asignados cargados dinámicamente -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal para mostrar los productos -->
<div id="productModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 class="text-xl font-bold mb-4">Productos de la Entrada de Mercancía</h2>
        <ul id="productList" class="list-disc pl-5">
            <!-- Aquí se cargarán los productos dinámicamente -->
        </ul>
        <button class="bg-red-500 text-white px-4 py-2 rounded mt-4" onclick="closeProductModalD()">Cerrar</button>
    </div>
</div>