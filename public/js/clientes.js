function loadClients() {
    fetch("/api/clients")  // Llama a la API
        .then(response => response.json())
        .then(data => {
            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable('#clientsTable')) {
                $('#clientsTable').DataTable().destroy();
            }
            
            let tableBody = document.querySelector("#clientsTable tbody");
            tableBody.innerHTML = "";

            data.forEach(client => {
                appendClientRow(client);
            });
            
            // Inicializar DataTable después de cargar los datos
            initializeDataTable();
        });
}

function initializeDataTable() {
    $('#clientsTable').DataTable({
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando página _PAGE_ de _PAGES_ (_TOTAL_ registros en total)",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Último", 
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "emptyTable": "No hay datos disponibles en la tabla",
            "loadingRecords": "Cargando...",
            "processing": "Procesando..."
        },
        "pageLength": 10,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
        "responsive": true,
        "dom": '<"top"<"dataTables_filter"f>>rt<"bottom"<"dataTables_info"i><"dataTables_paginate"p>>',
        "columnDefs": [
            {
                "targets": 0,
                "orderable": true,
                "searchable": true,
                "className": "text-center",
                "width": "150px"
            },
            {
                "targets": 1,
                "orderable": true,
                "searchable": true,
                "width": "auto"
            },
            {
                "targets": 2,
                "orderable": false,
                "searchable": false,
                "className": "text-center",
                "width": "280px"
            }
        ],
        "order": [[1, 'asc']],
        "searching": true,
        "paging": true,
        "info": true,
        "autoWidth": false,
        "processing": true,
        "stateSave": false,
        "drawCallback": function(settings) {
            // Aplicar estilos después de cada redibujado
            $('.cell-ruc').removeClass('px-6 py-5').addClass('px-3 py-2');
            $('.cell-business-name').removeClass('px-6 py-5').addClass('px-3 py-2');
        },
        "initComplete": function(settings, json) {
            // Personalizar el campo de búsqueda
            $('.dataTables_filter input').attr('placeholder', 'Buscar clientes...');
            
            // Agregar clases personalizadas
            $('.dataTables_length select').addClass('form-select');
            $('.dataTables_filter input').addClass('form-control');
        }
    });
}

function validateRucDni(input) {
    // Elimina cualquier carácter que no sea un número
    input.value = input.value.replace(/[^0-9]/g, '');

    // Limita la longitud a 8 o 11 caracteres
    if (input.value.length > 11) {
        input.value = input.value.slice(0, 11);
    }
}

function appendClientRow(client) {
    let tableBody = document.querySelector("#clientsTable tbody");
    let row = document.createElement("tr");
    row.id = `row-${client.id}`;
    row.setAttribute("data-client-name", client.business_name.toLowerCase());
    
    row.innerHTML = `
        <td data-order="${client.ruc_dni}"><span class='cell-ruc'>${client.ruc_dni}</span></td>
        <td class='cell-business-name' data-order="${client.business_name}">${client.business_name}</td>
        <td class='text-center'>
            <div class="flex items-center justify-center gap-1">
                <button class="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition duration-200 ease-in-out flex items-center gap-1 shadow-sm" onclick="editClient(${client.id})">                    
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                </button>
                <button class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition duration-200 ease-in-out flex items-center gap-1 shadow-sm" onclick="showAddressForm(${client.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    Añadir
                </button>
                <button class="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition duration-200 ease-in-out flex items-center gap-1 shadow-sm" onclick="loadAddresses(${client.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    Ver
                </button>
            </div>
        </td>
    `;
    tableBody.appendChild(row);
}

// Funciones para manejar el modal de clientes
function openClientModal() {
    document.getElementById("clientModal").classList.remove("hidden");
}

function closeClientModal() {
    document.getElementById("clientModal").classList.add("hidden");
    document.getElementById("addClientForm").reset();
}

function addClient() {
    let rucDni = document.getElementById("rucDni").value;
    let businessName = document.getElementById("businessName").value;

    if (!rucDni || !businessName) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: rucDni, business_name: businessName })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Cliente creado, data recibida:", data);
        
        alert("Cliente registrado con éxito.");
        
        // Verificar que tenemos el cliente en la respuesta
        if (data.client) {
            console.log("Agregando cliente a la tabla:", data.client);
            
            // Opción más simple: recargar toda la tabla para evitar problemas con DataTables
            loadClients();
            
            console.log("Tabla recargada con el nuevo cliente");
        } else {
            console.error("No se recibió el objeto client en la respuesta");
            // Si no recibimos el cliente, recargar toda la tabla
            loadClients();
        }
        
        document.getElementById("addClientForm").reset();
        closeClientModal(); // Cierra el modal después de agregar el cliente
    })
    .catch(error => {
        console.error("Error al agregar cliente:", error);
        alert("Error al agregar el cliente. Por favor, intente nuevamente.");
    });
}

function editClient(id) {
    // Abrir el modal de edición
    openEditClientModal();
    
    // Obtener los valores actuales del DOM
    const rucDniCell = document.querySelector(`#row-${id} td:nth-child(1)`);
    const businessNameCell = document.querySelector(`#row-${id} td:nth-child(2)`);
    
    const rucDni = rucDniCell ? rucDniCell.textContent.trim() : '';
    const businessName = businessNameCell ? businessNameCell.textContent.trim() : '';
    
    // Llenar los campos con los datos actuales del DOM
    document.getElementById("editClientId").value = id;
    document.getElementById("editRucDni").value = rucDni;
    document.getElementById("editBusinessName").value = businessName;
}

// Funciones para manejar el modal de edición
function openEditClientModal() {
    document.getElementById("editClientModal").classList.remove("hidden");
}

function closeEditClientModal() {
    document.getElementById("editClientModal").classList.add("hidden");
    document.getElementById("editClientForm").reset();
}

function updateClient() {
    const id = document.getElementById("editClientId").value;
    const rucDni = document.getElementById("editRucDni").value;
    const businessName = document.getElementById("editBusinessName").value;

    if (!rucDni || !businessName) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    console.log("Iniciando actualización del cliente:", { id, rucDni, businessName });

    fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: rucDni, business_name: businessName })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Data recibida:", data);
        
        // Mostrar mensaje de éxito
        alert("Cliente actualizado con éxito.");
        
        // Actualizar las celdas manteniendo la estructura y clases CSS correctas
        const businessNameCell = document.querySelector(`#row-${id} td:nth-child(2)`);
        const rucDniCell = document.querySelector(`#row-${id} td:nth-child(1)`);
        
        if (businessNameCell && rucDniCell) {
            // Actualizar razón social
            businessNameCell.innerHTML = businessName;
            businessNameCell.className = 'cell-business-name';
            businessNameCell.setAttribute('data-order', businessName);
            
            // Actualizar RUC/DNI manteniendo la estructura HTML correcta con span
            rucDniCell.innerHTML = `<span class='cell-ruc'>${rucDni}</span>`;
            rucDniCell.className = '';
            rucDniCell.setAttribute('data-order', rucDni);
            
            // También actualizar el atributo data-client-name de la fila
            const row = document.querySelector(`#row-${id}`);
            if (row) {
                row.setAttribute("data-client-name", businessName.toLowerCase());
            }
            
            console.log("Celdas actualizadas correctamente");
        } else {
            console.error("No se encontraron las celdas a actualizar");
        }
        
        // Cerrar modal
        closeEditClientModal();
        
        console.log("Actualización completada exitosamente");
    })
    .catch(error => {
        console.error("Error completo:", error);
        alert("Error al actualizar el cliente. Por favor, intente nuevamente.");
    });
}

function showAddressForm(clientId) {
    // Abrir el modal de agregar dirección
    openAddAddressModal();
    
    // Establecer el ID del cliente en el modal
    document.getElementById("modalClientId").value = clientId;
}

function loadAddresses(clientId) {
    // Abrir el modal de ver direcciones
    openViewAddressModal();
    
    // Limpiar el contenido anterior
    const modalAddressList = document.getElementById("modalAddressList");
    modalAddressList.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <svg class="animate-spin h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Cargando direcciones...</span>
        </div>
    `;

    fetch(`/api/client-addresses/${clientId}`)
        .then(response => response.json())
        .then(data => {
            modalAddressList.innerHTML = "";

            // Si la respuesta contiene un mensaje (caso de error o sin direcciones)
            if (data.message) {
                modalAddressList.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-lg font-medium">${data.message}</p>
                        <p class="text-sm mt-2">No hay direcciones registradas para este cliente</p>
                    </div>
                `;
            }
            // Si la respuesta es un array de direcciones
            else if (Array.isArray(data) && data.length > 0) {
                data.forEach(address => {
                    const addressDiv = document.createElement('div');
                    addressDiv.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200';
                    addressDiv.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="bg-blue-100 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">${address.address}</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">${address.zone}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out flex items-center gap-1 text-sm" onclick="editAddress(${address.id}, '${address.address.replace(/'/g, "\\'")}', '${address.zone.replace(/'/g, "\\'")}')">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Editar
                            </button>
                        </div>
                    `;
                    modalAddressList.appendChild(addressDiv);
                });
            }
            // Si no hay direcciones (caso extremo)
            else {
                modalAddressList.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-lg font-medium">No hay direcciones disponibles</p>
                        <p class="text-sm mt-2">Este cliente no tiene direcciones registradas</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error("Error al cargar direcciones:", error);
            modalAddressList.innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-lg font-medium">Error al cargar direcciones</p>
                    <p class="text-sm mt-2">No se pudieron obtener las direcciones del cliente</p>
                </div>
            `;
        });
}

// Funciones para manejar el modal de agregar dirección
function openAddAddressModal() {
    document.getElementById("addAddressModal").classList.remove("hidden");
}

function closeAddAddressModal() {
    document.getElementById("addAddressModal").classList.add("hidden");
    document.getElementById("addAddressForm").reset();
}

// Funciones para manejar el modal de ver direcciones
function openViewAddressModal() {
    document.getElementById("viewAddressModal").classList.remove("hidden");
}

function closeViewAddressModal() {
    document.getElementById("viewAddressModal").classList.add("hidden");
    document.getElementById("modalAddressList").innerHTML = "";
}

function addModalAddress() {
    const clientId = document.getElementById("modalClientId").value;
    const address = document.getElementById("modalAddress").value;
    const zone = document.getElementById("modalZone").value;

    if (!address || !zone) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    fetch("/api/client-addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({client_id: clientId, address: address, zone: zone })
    })
    .then(response => response.json())
    .then(data => {
        alert("Dirección agregada correctamente.");
        closeAddAddressModal();
    })
    .catch(error => {
        console.error("Error al agregar dirección:", error);
        alert("Error al agregar la dirección. Por favor, intente nuevamente.");
    });
}

function editAddress(addressId, currentAddress, currentZone) {
    // Crear un formulario para editar la dirección
    const addressForm = document.createElement('div');
    addressForm.innerHTML = `
        <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
            <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Editar Dirección
                    </h2>
                    <button type="button" class="close-edit-modal text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección:</label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" class="edit-address-input w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" value="${currentAddress}" placeholder="Ingrese la dirección">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Zona:</label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <input type="text" class="edit-zone-input w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" value="${currentZone}" placeholder="Ingrese la zona">
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3 pt-2">
                        <button type="button" class="cancel-edit-btn inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            Cancelar
                        </button>
                        <button type="button" class="save-edit-btn inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Añadir el formulario al DOM
    document.body.appendChild(addressForm);
    
    // Obtener referencias a los elementos dentro del modal
    const closeBtn = addressForm.querySelector('.close-edit-modal');
    const cancelBtn = addressForm.querySelector('.cancel-edit-btn');
    const saveBtn = addressForm.querySelector('.save-edit-btn');
    const addressInput = addressForm.querySelector('.edit-address-input');
    const zoneInput = addressForm.querySelector('.edit-zone-input');
    
    // Función para cerrar el modal
    const closeModal = () => {
        document.body.removeChild(addressForm);
    };
    
    // Configurar los eventos de los botones
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Cerrar al hacer clic fuera del modal
    addressForm.addEventListener('click', (e) => {
        if (e.target === addressForm) {
            closeModal();
        }
    });
    
    saveBtn.addEventListener('click', () => {
        const newAddress = addressInput.value.trim();
        const newZone = zoneInput.value.trim();
        
        if (!newAddress || !newZone) {
            alert("Por favor, complete todos los campos.");
            return;
        }
        
        // Deshabilitar el botón mientras se procesa
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
        `;
        
        fetch(`/api/client-addresses/${addressId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: newAddress, zone: newZone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Dirección actualizada correctamente");
            closeModal();
            // Si el modal de ver direcciones está abierto, actualizar la lista
            if (!document.getElementById("viewAddressModal").classList.contains("hidden")) {
                const clientId = data.client_id;
                loadAddresses(clientId);
            }
        })
        .catch(error => {
            console.error("Error al editar dirección:", error);
            alert("Error al actualizar la dirección");
            
            // Restaurar el botón
            saveBtn.disabled = false;
            saveBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Guardar
            `;
        });
    });
}