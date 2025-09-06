<h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Proveedores</h1>

<!-- Modal para agregar proveedor -->
<div id="supplierModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Agregar Proveedor</h2>
            <button id="closeSupplierModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="addSupplierForm" class="space-y-4">
            <div class="mb-4">
                <label for="rucDni" class="block text-sm font-semibold text-gray-700 mb-1">RUC/DNI:</label>
                <input 
                    type="text" 
                    id="rucDni" 
                    class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    maxlength="11"
                    pattern="\d{8}|\d{11}"
                    title="Debe ingresar 8 o 11 dígitos"
                    oninput="validateRucDni(this)"
                    placeholder="Ingrese RUC o DNI"
                >
            </div>
            <div class="mb-6">
                <label for="businessName" class="block text-sm font-semibold text-gray-700 mb-1">Razón Social:</label>
                <input 
                    type="text" 
                    id="businessName" 
                    class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    required
                    placeholder="Ingrese razón social"
                >
            </div>
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Guardar Proveedor</button>
        </form>
    </div>
</div>

<!-- Modal para editar proveedor -->
<div id="editSupplierModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Editar Proveedor</h2>
            <button id="closeEditSupplierModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="editSupplierForm" class="space-y-4">
            <input type="hidden" id="editSupplierId">
            <div class="mb-4">
                <label for="editRucDni" class="block text-sm font-semibold text-gray-700 mb-1">RUC/DNI:</label>
                <input 
                    type="text" 
                    id="editRucDni" 
                    class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    maxlength="11" 
                    pattern="\d{8}|\d{11}" 
                    title="Debe ingresar 8 o 11 dígitos" 
                    oninput="validateRucDni(this)"
                    placeholder="Ingrese RUC o DNI"
                >
            </div>
            <div class="mb-6">
                <label for="editBusinessName" class="block text-sm font-semibold text-gray-700 mb-1">Razón Social:</label>
                <input 
                    type="text" 
                    id="editBusinessName" 
                    class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    required
                    placeholder="Ingrese razón social"
                >
            </div>
            <div class="flex gap-3">
                <button type="button" id="cancelEditBtn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition duration-300 ease-in-out">Cancelar</button>
                <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Actualizar Proveedor</button>
            </div>
        </form>
    </div>
</div>

<!-- Listado de Proveedores desde API -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Lista de Proveedores</h2>
        <button id="openSupplierModalBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Agregar Proveedor
        </button>
    </div>
    <div class="overflow-x-auto">
        <table id="suppliersTable" class="w-full table-improved">
            <thead>
                <tr>
                    <th>RUC/DNI</th>
                    <th>Razón Social</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se cargarán los datos desde la API -->
            </tbody>
        </table>
    </div>
</div>