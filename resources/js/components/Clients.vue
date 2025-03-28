<template>

    <div>
        <h2 class="text-xl font-bold mb-4">Lista de Clientes</h2>
        <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded mb-4">➕ Agregar Cliente</button>
        <table class="w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border border-gray-300 px-4 py-2">ID</th>
                    <th class="border border-gray-300 px-4 py-2">RUC/DNI</th>
                    <th class="border border-gray-300 px-4 py-2">Razón Social</th>
                    <th class="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in clients" :key="client.id" class="text-center">
                    <td class="border border-gray-300 px-4 py-2">{{ client.id }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ client.ruc_dni }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ client.business_name }}</td>
                    <td class="border border-gray-300 px-4 py-2">
                        <button @click="editClient(client)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">✏️ Editar</button>
                        <button @click="deleteClient(client.id)" class="bg-red-500 text-white px-2 py-1 rounded">🗑️ Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        

        <!-- Modal para editar cliente -->
        <div v-if="showEditModal" class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h3 class="text-lg font-bold mb-4">Editar Cliente</h3>
                <input v-model="currentClient.ruc_dni" placeholder="RUC/DNI" class="border p-2 w-full mb-2 rounded">
                <input v-model="currentClient.business_name" placeholder="Razón Social" class="border p-2 w-full mb-2 rounded">
                <div class="flex justify-end">
                    <button @click="showEditModal = false" class="bg-gray-400 text-white px-4 py-2 rounded mr-2">Cancelar</button>
                    <button @click="updateClient" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal para agregar cliente -->
        <div v-if="showAddModal" class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h3 class="text-lg font-bold mb-4">Agregar Cliente</h3>
                <input v-model="newClient.ruc_dni" placeholder="RUC/DNI" class="border p-2 w-full mb-2 rounded">
                <input v-model="newClient.business_name" placeholder="Razón Social" class="border p-2 w-full mb-2 rounded">
                <div class="flex justify-end">
                    <button @click="showAddModal = false" class="bg-gray-400 text-white px-4 py-2 rounded mr-2">Cancelar</button>
                    <button @click="addClient" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const clients = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const newClient = ref({ ruc_dni: '', business_name: '' });
const currentClient = ref({ id: null, ruc_dni: '', business_name: '' });

// Función para obtener los clientes desde la API
const fetchClients = async () => {
    try {
        const response = await axios.get('/api/clients'); // Ajusta la ruta según tu API
        clients.value = response.data;
    } catch (error) {
        console.error('Error al obtener clientes:', error);
    }
};

// Función para agregar un nuevo cliente
const addClient = async () => {
    try {
        const response = await axios.post('/api/clients', newClient.value);
        clients.value.push(response.data);
        showAddModal.value = false;
        newClient.value = { ruc_dni: '', business_name: '' };
    } catch (error) {
        console.error('Error al agregar cliente:', error);
    }
};

// Función para eliminar un cliente
const deleteClient = async (clientId) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
            await axios.delete(`/api/clients/${clientId}`);
            fetchClients();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    }
};

// Función para editar un cliente
const editClient = (client) => {
    currentClient.value = { ...client };
    showEditModal.value = true;
};

// Función para actualizar un cliente
const updateClient = async () => {
    try {
        const response = await axios.put(`/api/clients/${currentClient.value.id}`, currentClient.value);
        const index = clients.value.findIndex(client => client.id === currentClient.value.id);
        clients.value[index] = response.data;
        showEditModal.value = false;
        currentClient.value = { id: null, ruc_dni: '', business_name: '' };
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
    }
};

// Llamar la función cuando el componente se monta
onMounted(fetchClients);
</script>

