<h1 class="text-2xl font-bold mb-4">Gestión de Clientes</h1>
<div class="bg-white p-4 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Agregar Cliente</h2>
        <form id="addClientForm">
            <div class="mb-2">
                <label class="block">RUC/DNI:</label>
                <input type="text" id="rucDni" class="border p-2 w-full" required>
            </div>
            <div class="mb-2">
                <label class="block">Razón Social:</label>
                <input type="text" id="businessName" class="border p-2 w-full" required>
            </div>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Agregar</button>
        </form>
</div>

<!-- Filtro de búsqueda de clientes -->
<div class="mb-4">
    <input 
            type="text" 
            id="searchInput" 
            placeholder="Buscar cliente por nombre..." 
            class="border border-gray-300 rounded px-4 py-2 w-full"
            oninput="filterClients()"
        />
</div>

<!-- Listado de Clientes desde API -->
<div class="bg-white p-4 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Lista de Clientes</h2>
    <table id="clientsTable" class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-200">
                <th class="border p-2">ID</th>
                <th class="border p-2">RUC/DNI</th>
                <th class="border p-2">Razón Social</th>
                <th class="border p-2">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí se llenarán los clientes dinámicamente -->
        </tbody>
    </table>
</div>