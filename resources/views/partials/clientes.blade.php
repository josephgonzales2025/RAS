<h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Clientes</h1>

<!-- Modal para agregar cliente -->
<div id="clientModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Agregar Cliente</h2>
            <button id="closeClientModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="addClientForm" class="space-y-4">
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
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Guardar Cliente</button>
        </form>
    </div>
</div>

<!-- Modal para editar cliente -->
<div id="editClientModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Editar Cliente</h2>
            <button id="closeEditClientModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="editClientForm" class="space-y-4">
            <input type="hidden" id="editClientId">
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
                <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Actualizar Cliente</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para agregar dirección -->
<div id="addAddressModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                Nueva Dirección
            </h2>
            <button id="closeAddAddressModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form id="addAddressForm" class="space-y-4">
            <input type="hidden" id="modalClientId">
            <div class="mb-4">
                <label for="modalAddress" class="block text-sm font-semibold text-gray-700 mb-1">Dirección:</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="modalAddress" 
                        class="border border-gray-300 rounded-lg pl-10 py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"  
                        required
                        placeholder="Ingrese la dirección"
                    >
                </div>
            </div>
            <div class="mb-6">
                <label for="modalZone" class="block text-sm font-semibold text-gray-700 mb-1">Zona:</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="modalZone" 
                        class="border border-gray-300 rounded-lg pl-10 py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out" 
                        required
                        placeholder="Ingrese la zona"
                    >
                </div>
            </div>
            <div class="flex gap-3">
                <button type="button" id="cancelAddAddressBtn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition duration-300 ease-in-out">Cancelar</button>
                <button type="submit" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md">Guardar Dirección</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para ver direcciones -->
<div id="viewAddressModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                Direcciones del Cliente
            </h2>
            <button id="closeViewAddressModalBtn" class="text-gray-500 hover:text-gray-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div id="modalAddressList" class="space-y-3 max-h-96 overflow-y-auto">
            <!-- Aquí se cargarán las direcciones dinámicamente -->
        </div>
        <div class="flex justify-end mt-6">
            <button id="closeViewAddressBtn" class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition duration-300 ease-in-out">Cerrar</button>
        </div>
    </div>
</div>

<!-- Listado de Clientes desde API -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Lista de Clientes</h2>
        <button id="openClientModalBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Agregar Cliente
        </button>
    </div>
    <div class="overflow-x-auto">
        <table id="clientsTable" class="w-full table-improved">
            <thead>
                <tr>
                    <th>RUC/DNI</th>
                    <th>Razón Social</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se llenarán los clientes dinámicamente -->
            </tbody>
        </table>
    </div>
</div>