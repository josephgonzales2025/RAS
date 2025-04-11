{{-- filepath: resources/views/partials/merchandise_entries.blade.php --}}
<h1 class="text-2xl font-bold mb-4">Entradas de Mercancía</h1>

{{-- Formulario para agregar una nueva entrada --}}
<div class="bg-white p-4 rounded shadow mb-6">
    <h2 class="text-xl font-bold mb-4">Agregar Entrada de Mercancía</h2>
    <form id="addMerchandiseEntryForm">
        <div class="mb-2">
            <label for="reception_date" class="block">Fecha de Recepción:</label>
            <input type="date" id="reception_date" name="reception_date" class="border p-2 w-full" required>
        </div>
        <div class="mb-2">
            <label for="guide_number" class="block">Número de Guía:</label>
            <input type="text" id="guide_number" name="guide_number" class="border p-2 w-full" required>
        </div>
        <div class="mb-2">
            <label for="supplier_id" class="block">Proveedor:</label>
            <select id="supplier_id" name="supplier_id" class="border p-2 w-full" required>
                {{-- Opciones dinámicas cargadas desde la API --}}
            </select>
        </div>
        <div class="mb-2">
            <label for="client_id" class="block">Cliente:</label>
            <select id="client_id" name="client_id" class="border p-2 w-full" required>
                {{-- Opciones dinámicas cargadas desde la API --}}
            </select>
        </div>
        <div class="mb-2">
            <label for="client_address_id" class="block">Dirección del Cliente:</label>
            <select id="client_address_id" name="client_address_id" class="border p-2 w-full" required>
                {{-- Opciones dinámicas cargadas desde la API --}}
            </select>
        </div>
        <div class="mb-2">
            <label for="total_weight" class="block">Peso Total (kg):</label>
            <input type="number" id="total_weight" name="total_weight" class="border p-2 w-full" step="0.01" required oninput="validateNumericInput(this)">
        </div>
        <div class="mb-2">
            <label for="total_freight" class="block">Flete Total:</label>
            <input type="number" id="total_freight" name="total_freight" class="border p-2 w-full" step="0.01" required oninput="validateNumericInput(this)">
        </div>
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">Agregar Entrada</button>
    </form>
</div>

<div class="mb-4">
    <label for="searchInput" class="block text-sm font-medium text-gray-700">Buscar:</label>
    <input
        type="text"
        id="searchInput"
        class="border border-gray-300 rounded px-4 py-2 w-full"
        placeholder="Escribe el nombre del cliente o proveedor..."
        oninput="filterTableM()"
    />
</div>

{{-- Botón para asignar registros al despacho --}}
<div class="mb-4">
    
</div>

{{-- Tabla para listar las entradas de mercancía --}}
<div class="bg-white p-4 rounded shadow">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Lista de Entradas de Mercancía</h2>
        <button id="assignToDispatchButton" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onclick="openAssignToDispatchModal()">Asignar al despacho</button>
    </div>
    <table id="merchandiseEntriesTable" class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-200">
                <th class="border p-2 min-w-[50px]">Fecha de Recepción</th>
                <th class="border p-2">Número de Guía</th>
                <th class="border p-2 min-w-[300px]">Proveedor</th>
                <th class="border p-2 min-w-[300px]">Cliente</th>
                <th class="border p-2">Dirección del Cliente</th>
                <th class="border p-2 min-w-[200px]">Zona</th>
                <th class="border p-2 min-w-[80px]">Peso Total</th>
                <th class="border p-2">Flete Total</th>
                <th class="border p-2">Acciones</th>
                <th class="border p-2"><input type="checkbox" id="selectAllCheckbox" onclick="toggleSelectAll(this)"></th>
            </tr>
        </thead>
        <tbody>
            {{-- Filas dinámicas cargadas desde la API --}}
        </tbody>
    </table>
</div>

{{-- Modal para asignar registros al despacho --}}
<div id="assignToDispatchModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">Asignar al Despacho</h2>
        <div class="mb-4">
            <label for="dispatchSelect" class="block font-bold">Seleccionar Despacho</label>
            <select id="dispatchSelect" class="w-full border rounded p-2">
                {{-- Opciones dinámicas cargadas desde la API --}}
            </select>
        </div>
        <div class="flex justify-end">
            <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2" onclick="closeAssignToDispatchModal()">Cancelar</button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="assignSelectedEntriesToDispatch()">Asignar</button>
        </div>
    </div>
</div>

<!-- Modal para editar entrada de mercancía -->
<div id="editModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 class="text-xl font-bold mb-4">Editar Entrada de Mercancía</h2>
        <form id="editMerchandiseEntryForm">
            <div class="mb-2">
                <label for="edit_reception_date" class="block">Fecha de Recepción:</label>
                <input type="date" id="edit_reception_date" name="reception_date" class="border p-2 w-full" required>
            </div>
            <div class="mb-2">
                <label for="edit_guide_number" class="block">Número de Guía:</label>
                <input type="text" id="edit_guide_number" name="guide_number" class="border p-2 w-full" required>
            </div>
            <div class="mb-2">
                <label for="edit_supplier_id" class="block">Proveedor:</label>
                <select id="edit_supplier_id" name="supplier_id" class="border p-2 w-full" required>
                    <option value="">Escoja un proveedor</option>
                    <!-- Opciones dinámicas -->
                </select>
            </div>
            <div class="mb-2">
                <label for="edit_client_id" class="block">Cliente:</label>
                <select id="edit_client_id" name="client_id" class="border p-2 w-full" required>
                    <option value="">Escoja un cliente</option>
                    <!-- Opciones dinámicas -->
                </select>
            </div>
            <div class="mb-2">
                <label for="edit_client_address_id" class="block">Dirección del Cliente:</label>
                <select id="edit_client_address_id" name="client_address_id" class="border p-2 w-full" required>
                    <!-- Opciones dinámicas -->
                </select>
            </div>
            <div class="mb-2">
                <label for="edit_total_weight" class="block">Peso Total (kg):</label>
                <input type="number" id="edit_total_weight" name="total_weight" class="border p-2 w-full" required>
            </div>
            <div class="mb-2">
                <label for="edit_total_freight" class="block">Flete Total:</label>
                <input type="number" id="edit_total_freight" name="total_freight" class="border p-2 w-full" required>
            </div>
            <div class="flex justify-end">
                <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded mr-2" onclick="closeEditModal()">Cancelar</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar</button>
            </div>
        </form>
    </div>
</div>

<div id="productModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/2">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Agregar Productos a la Entrada</h2>
            <button class="text-red-500 font-bold" onclick="closeProductModal()">X</button>
        </div>
        <ul id="productList" class="mb-4"></ul>
        <form id="addProductForm">
            <input type="hidden" id="productId">
            <div class="mb-3">
                <label for="productName" class="block font-bold">Nombre del Producto</label>
                <input type="text" id="productName" name="productName" class="w-full border rounded p-2" required>
            </div>
            <div class="mb-3">
                <label for="quantity" class="block font-bold">Cantidad</label>
                <input type="number" id="quantity" name="quantity" class="w-full border rounded p-2" required>
            </div>
            <div class="mb-3">
                <label for="type" class="block font-bold">Tipo</label>
                <input type="text" id="type" name="type" class="w-full border rounded p-2">
            </div>
            <button type="button" class="bg-blue-500 text-white px-4 py-2 rounded" onclick="handleAddOrUpdateProduct()">Guardar Producto</button>
        </form>
    </div>
</div>