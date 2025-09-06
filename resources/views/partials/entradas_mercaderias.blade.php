{{-- filepath: resources/views/partials/merchandise_entries.blade.php --}}

{{-- Header con estilo moderno --}}
<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
    <h1 class="text-3xl font-bold mb-2">Gestión de Entradas de Mercadería</h1>
    <p class="text-indigo-100">Administra las entradas de mercadería, revisa el inventario y realiza seguimiento de los productos.</p>
</div>





{{-- Sección principal de entradas --}}
<div class="bg-white rounded-lg shadow-lg border border-gray-200">
    {{-- Header de la tabla --}}
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
        <div class="flex justify-between items-center sm:space-x-4 flex-col sm:flex-row">
            <div class="flex items-center space-x-3">
                <div class="bg-indigo-100 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800">Lista de Entradas de Mercadería</h2>
            </div>
            <div class="flex space-x-3">
                <button onclick="openAddEntryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Nueva Entrada</span>
                </button>
                <button id="assignToDispatchButton" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm flex items-center space-x-2" onclick="openAssignToDispatchModal()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h4z"></path>
                    </svg>
                    <span>Asignar a Despacho</span>
                </button>
            </div>
        </div>
    </div>
    {{-- Contenido de la tabla --}}
    <div class="p-6">
        <div class="overflow-x-auto">
            <table id="merchandiseEntriesTable" class="w-full border-collapse display nowrap" style="width:100%">
                <thead>
                    <tr class="bg-gray-100 border-b border-gray-200">
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">FECHA RECEP.</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">NO. GUÍA</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">PROVEEDOR</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">CLIENTE</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">DIRECCIÓN</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ZONA</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">PESO (KG)</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">FLETE (S/)</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-700 text-sm">ACCIONES</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                            <input type="checkbox" id="selectAllCheckbox" onclick="toggleSelectAll(this)" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                        </th>
                    </tr>
                </thead>
                <tbody id="merchandiseEntriesTableBody">
                    {{-- Filas dinámicas cargadas desde la API --}}
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Modal para asignar registros al despacho --}}
<div id="assignToDispatchModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Asignar al Despacho</h2>
            <div class="mb-4">
                <label for="dispatchSelect" class="block font-medium text-gray-700 mb-2">Seleccionar Despacho</label>
                <select id="dispatchSelect" class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {{-- Opciones dinámicas cargadas desde la API --}}
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors" onclick="closeAssignToDispatchModal()">Cancelar</button>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors" onclick="assignSelectedEntriesToDispatch()">Asignar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal para editar entrada de mercancía -->
<div id="editModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">Editar Entrada de Mercancía</h2>
            <form id="editMerchandiseEntryForm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label for="edit_reception_date" class="block text-sm font-medium text-gray-700 mb-2">Fecha de Recepción:</label>
                        <input type="date" id="edit_reception_date" name="reception_date" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="edit_guide_number" class="block text-sm font-medium text-gray-700 mb-2">Número de Guía:</label>
                        <input type="text" id="edit_guide_number" name="guide_number" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="edit_supplier_id" class="block text-sm font-medium text-gray-700 mb-2">Proveedor:</label>
                        <select id="edit_supplier_id" name="supplier_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            <option value="">Escoja un proveedor</option>
                            <!-- Opciones dinámicas -->
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="edit_client_id" class="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
                        <select id="edit_client_id" name="client_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            <option value="">Escoja un cliente</option>
                            <!-- Opciones dinámicas -->
                        </select>
                    </div>
                    <div class="mb-4 md:col-span-2">
                        <label for="edit_client_address_id" class="block text-sm font-medium text-gray-700 mb-2">Dirección del Cliente:</label>
                        <select id="edit_client_address_id" name="client_address_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            <!-- Opciones dinámicas -->
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="edit_total_weight" class="block text-sm font-medium text-gray-700 mb-2">Peso Total (kg):</label>
                        <input type="number" id="edit_total_weight" name="total_weight" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="edit_total_freight" class="block text-sm font-medium text-gray-700 mb-2">Flete Total:</label>
                        <input type="number" id="edit_total_freight" name="total_freight" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors" onclick="closeEditModal()">Cancelar</button>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors">Actualizar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div id="productModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                <h2 class="text-xl font-bold text-gray-800">Agregar Productos a la Entrada</h2>
                <button class="text-gray-400 hover:text-red-500 transition-colors" onclick="closeProductModal()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <ul id="productList" class="mb-6"></ul>
            <form id="addProductForm">
                <input type="hidden" id="productId">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="mb-4 md:col-span-2">
                        <label for="productName" class="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                        <input type="text" id="productName" name="productName" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input type="number" id="quantity" name="quantity" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <input type="text" id="type" name="type" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                    </div>
                </div>
                <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button type="button" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors" onclick="handleAddOrUpdateProduct()">
                        Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Modal para agregar nueva entrada de mercancía --}}
<div id="addEntryModal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                <h2 class="text-xl font-bold text-gray-800">Agregar Entrada de Mercancía</h2>
                <button class="text-gray-400 hover:text-red-500 transition-colors" onclick="closeAddEntryModal()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form id="addMerchandiseEntryForm">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="mb-4">
                        <label for="reception_date" class="block text-sm font-medium text-gray-700 mb-2">Fecha de Recepción:</label>
                        <input type="date" id="reception_date" name="reception_date" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="guide_number" class="block text-sm font-medium text-gray-700 mb-2">Número de Guía:</label>
                        <input type="text" id="guide_number" name="guide_number" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div class="mb-4">
                        <label for="supplier_id" class="block text-sm font-medium text-gray-700 mb-2">Proveedor:</label>
                        <select id="supplier_id" name="supplier_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            <option value="">ESCOJA UN PROVEEDOR</option>
                            {{-- Opciones dinámicas cargadas desde la API --}}
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="client_id" class="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
                        <select id="client_id" name="client_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            <option value="">ESCOJA UN CLIENTE</option>
                            {{-- Opciones dinámicas cargadas desde la API --}}
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="client_address_id" class="block text-sm font-medium text-gray-700 mb-2">Dirección del Cliente:</label>
                        <select id="client_address_id" name="client_address_id" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required>
                            {{-- Opciones dinámicas cargadas desde la API --}}
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="total_weight" class="block text-sm font-medium text-gray-700 mb-2">Peso Total (kg):</label>
                        <input type="number" id="total_weight" name="total_weight" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" step="0.01" required oninput="validateNumericInput(this)">
                    </div>
                    <div class="mb-4">
                        <label for="total_freight" class="block text-sm font-medium text-gray-700 mb-2">Flete Total:</label>
                        <input type="number" id="total_freight" name="total_freight" class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" step="0.01" required oninput="validateNumericInput(this)">
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors" onclick="closeAddEntryModal()">Cancelar</button>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm">
                        Agregar Entrada
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>