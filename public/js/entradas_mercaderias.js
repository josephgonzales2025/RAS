document.addEventListener("DOMContentLoaded", function () {
    // Inicializa Select2 en los campos de proveedor y cliente
    $('#supplier_id').select2({
        placeholder: "Seleccione un proveedor",
        allowClear: true,
        dropdownParent: $('#entryModal')
    });

    $('#client_id').select2({
        placeholder: "Seleccione un cliente",
        allowClear: true,
        dropdownParent: $('#entryModal')
    });
    
    // Cargar datos iniciales
    loadSuppliersM();
    loadClientsM();
    loadMerchandiseEntries(); // Cargar la tabla de entradas
    loadMerchandiseEntriesTable(); // Cargar la tabla de entradas de mercancía
    
    // El setupEntryModal() ahora se llama desde initializeEntradas_Mercaderias() después del contenido AJAX
    
    // Estos event listeners se configuran en initializeEntradas_Mercaderias() para evitar duplicación
    // Configurar evento de cambio de cliente para cargar direcciones
    // $('#client_id').on('change', function() {
    //     loadClientAddresses();
    // });
    
    // Configurar envío del formulario
    // $('#addMerchandiseEntryForm').on('submit', function(e) {
    //     e.preventDefault();
    //     submitEntryForm();
    // });
    
    // Configurar búsqueda en la tabla
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        const rows = $('.merchandise-entries-table tbody tr');
        
        rows.each(function() {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(searchTerm) > -1);
        });
    });
});

// Función para configurar el modal
function setupEntryModal() {
    const modal = document.getElementById('entryModal');
    const openModalBtn = document.getElementById('openEntryModalBtn');
    const closeModalBtn = document.getElementById('closeEntryModalBtn');
    
    // Verificar que todos los elementos existan antes de configurar eventos
    if (!modal || !openModalBtn || !closeModalBtn) {
        console.error('Elementos del modal no encontrados:', {
            modal: !!modal,
            openModalBtn: !!openModalBtn,
            closeModalBtn: !!closeModalBtn
        });
        return;
    }
    
    // Abrir modal
    openModalBtn.addEventListener('click', function() {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    // Cerrar modal
    closeModalBtn.addEventListener('click', function() {
        closeEntryModal();
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEntryModal();
        }
    });
}

// Función para cerrar el modal
function closeEntryModal() {
    const modal = document.getElementById('entryModal');
    const form = document.getElementById('addMerchandiseEntryForm');
    
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    
    if (form) {
        form.reset();
    }
}

// Función para enviar el formulario
function submitEntryForm() {
    // Obtener datos del formulario
    const formData = {
        reception_date: document.getElementById('reception_date').value,
        guide_number: document.getElementById('guide_number').value,
        supplier_id: document.getElementById('supplier_id').value,
        client_id: document.getElementById('client_id').value,
        client_address_id: document.getElementById('client_address_id').value,
        total_weight: document.getElementById('total_weight').value,
        total_freight: document.getElementById('total_freight').value
    };
    
    // Enviar datos a la API
    fetch('/api/merchandise-entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la entrada de mercancía');
        }
        return response.json();
    })
    .then(data => {
        // Mostrar mensaje de éxito
        alert('Entrada de mercancía registrada correctamente');
        
        // Cerrar modal y recargar datos
        closeEntryModal();
        
        // Recargar la tabla de entradas
        loadMerchandiseEntries();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar la entrada de mercancía: ' + error.message);
    });
}

function validateNumericInput(input) {
    // Obtén la posición actual del cursor
    const cursorPosition = input.selectionStart;

    // Permitir solo números y un punto decimal
    let sanitizedValue = input.value.replace(/[^0-9.]/g, ''); // Elimina caracteres no válidos

    // Evitar múltiples puntos decimales
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts[1]; // Mantén solo el primer punto decimal
    }

    // Asigna el valor limpio al input solo si ha cambiado
    if (input.value !== sanitizedValue) {
        input.value = sanitizedValue;

        // Restaura la posición del cursor
        input.setSelectionRange(cursorPosition, cursorPosition);
    }
}

function loadSuppliersM() {
    fetch('/api/suppliers')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => (a.business_name || "").localeCompare(b.business_name || ""));
            const supplierSelect = $('#supplier_id');
            supplierSelect.empty(); // Limpia las opciones existentes
            supplierSelect.append(new Option("Escoja un proveedor", "")); // Agrega la opción predeterminada
            data.forEach(supplier => {
                supplierSelect.append(new Option(supplier.business_name, supplier.id));
            });
        })
        .catch(error => console.error('Error al cargar proveedores:', error));
}

function loadClientsM() {
    fetch('/api/clients')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => (a.business_name || "").localeCompare(b.business_name || ""));
            const clientSelect = $('#client_id');
            clientSelect.empty(); // Limpia las opciones existentes
            clientSelect.append(new Option("Escoja un cliente", ""));
            data.forEach(client => {
                clientSelect.append(new Option(client.business_name, client.id));
            });
        })
        .catch(error => console.error('Error al cargar clientes:', error));
}

function loadClientAddresses() {
    const clientId = document.getElementById("client_id").value; // Obtiene el ID del cliente seleccionado

    if (!clientId) {
        console.error("No se seleccionó un cliente.");
        return;
    }

    fetch(`/api/client-addresses/${clientId}`) // Llama a la API para obtener las direcciones del cliente
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar direcciones del cliente: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const addressSelect = document.getElementById("client_address_id");
            addressSelect.innerHTML = ""; // Limpia las opciones existentes

            if (data.length === 0) {
                // Si no hay direcciones, muestra un mensaje
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "No hay direcciones disponibles";
                addressSelect.appendChild(option);
                return;
            }

            // Agrega las direcciones al desplegable
            data.forEach(address => {
                const option = document.createElement("option");
                option.value = address.id;
                option.textContent = address.address;
                addressSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar direcciones del cliente:", error));
}

// Función para cargar la tabla de entradas de mercancía
function loadMerchandiseEntries() {
    fetch('/api/merchandise-entries')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar entradas de mercancía: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Obtener la tabla y limpiar su contenido actual
            const tableBody = document.querySelector('.merchandise-entries-table tbody');
            if (!tableBody) {
                console.error('No se encontró el cuerpo de la tabla de entradas de mercancía');
                return;
            }
            
            tableBody.innerHTML = '';
            
            // Si no hay datos, mostrar mensaje
            if (data.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `<td colspan="7" class="text-center py-4">No hay entradas de mercancía registradas</td>`;
                tableBody.appendChild(emptyRow);
                return;
            }
            
            // Agregar filas a la tabla
            data.forEach(entry => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-4 py-3 text-center">${entry.reception_date || '-'}</td>
                    <td class="px-4 py-3 text-center">${entry.guide_number || '-'}</td>
                    <td class="px-4 py-3">${entry.supplier_name || '-'}</td>
                    <td class="px-4 py-3">${entry.client_name || '-'}</td>
                    <td class="px-4 py-3 text-right">${entry.total_weight ? parseFloat(entry.total_weight).toFixed(2) + ' kg' : '-'}</td>
                    <td class="px-4 py-3 text-right">${entry.total_freight ? '$' + parseFloat(entry.total_freight).toFixed(2) : '-'}</td>
                    <td class="px-4 py-3 text-center">
                        <div class="flex justify-center space-x-2">
                            <button class="text-blue-600 hover:text-blue-800" onclick="viewEntryDetails(${entry.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <button class="text-green-600 hover:text-green-800" onclick="editEntry(${entry.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteEntry(${entry.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar entradas de mercancía:', error));
}

// Función para ver detalles de una entrada
function viewEntryDetails(entryId) {
    // Implementar la lógica para ver detalles
    console.log(`Ver detalles de la entrada ${entryId}`);
}

// Función para editar una entrada
function editEntry(entryId) {
    // Implementar la lógica para editar
    console.log(`Editar entrada ${entryId}`);
}

// Función para eliminar una entrada
function deleteEntry(entryId) {
    if (confirm('¿Está seguro de que desea eliminar esta entrada de mercancía?')) {
        // Implementar la lógica para eliminar
        console.log(`Eliminar entrada ${entryId}`);
    }
}

function loadMerchandiseEntriesTable() {
    const tableBody = document.querySelector("#merchandiseEntriesTable tbody");
    // Verificar si el elemento existe
    if (!tableBody) {
        console.warn("El elemento #merchandiseEntriesTable tbody no existe en el DOM.");
        return; // Salir de la función si el elemento no existe
    }

    fetch('/api/merchandise-entries') // Llama a la API para obtener las entradas de mercancía
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#merchandiseEntriesTable tbody");
            tableBody.innerHTML = ""; // Limpia las filas existentes en la tabla

            data.forEach(entry => {

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="border p-2">${entry.reception_date}</td>
                    <td class="border p-2">${entry.guide_number}</td>
                    <td class="border p-2">${entry.supplier ? entry.supplier.business_name : 'N/A'}</td>
                    <td class="border p-2">${entry.client ? entry.client.business_name : 'N/A'}</td>
                    <td class="border p-2">${entry.client_address ? entry.client_address.address : 'N/A'}</td>
                    <td class="border p-2">${entry.client_address ? entry.client_address.zone : 'N/A'}</td>
                    <td class="border p-2">${entry.total_weight} kg</td>
                    <td class="border p-2">${entry.total_freight}</td>
                    <td class="border p-2">
                        <div class="flex gap-2 justify-center">
                            <button class="bg-blue-500 text-white p-1 rounded" onclick="openEditModal(${entry.id})">Editar</button>
                            <button class="bg-orange-500 text-white p-1 rounded" onclick="openProductModal(${entry.id})">Ver Productos</button>
                        </div>
                    </td>
                    <td class="border p-2">
                        <input type="checkbox" class="entryCheckbox" value="${entry.id}">
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
        })
        .catch(error => console.error('Error al cargar las entradas de mercancía:', error));
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll(".entryCheckbox");
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function addMerchandiseEntry() {
    const form = document.getElementById("addMerchandiseEntryForm");

    // Validar que se haya seleccionado un proveedor y un cliente
    const supplierId = document.getElementById("supplier_id").value;
    const clientId = document.getElementById("client_id").value;

    if (!supplierId) {
        alert("Por favor, seleccione un proveedor.");
        return;
    }

    if (!clientId) {
        alert("Por favor, seleccione un cliente.");
        return;
    }

    // Crear un objeto FormData para obtener los datos del formulario
    const formData = new FormData(form);

    // Convertir FormData a un objeto JSON
    const data = Object.fromEntries(formData.entries());
    if (!data.reception_date) {
        alert("La fecha de recepción es obligatoria.");
        return;
    }

    // Enviar los datos al servidor mediante una solicitud POST
    fetch('/api/merchandise-entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(result => {
            console.log("Entrada de mercancía agregada con éxito:", result);
    
            // Actualizar la tabla de entradas de mercancía
            loadMerchandiseEntries();
    
            // Limpiar el formulario
            form.reset();
    
            // Mostrar un mensaje de éxito
            alert("Entrada de mercancía agregada con éxito.");
        })
        .catch(error => {
            console.error("Error al agregar la entrada de mercancía:", error);
            alert("Ocurrió un error al agregar la entrada de mercancía. Por favor, inténtelo de nuevo.");
        });
}

function loadSuppliersForModal() {
    return new Promise((resolve, reject) => {
        fetch('/api/suppliers')
            .then(response => response.json())
            .then(data => {
                const supplierSelect = document.getElementById("edit_supplier_id");
                supplierSelect.innerHTML = ""; // Limpia las opciones existentes
                data.forEach(supplier => {
                    const option = document.createElement("option");
                    option.value = supplier.id;
                    option.textContent = supplier.business_name;
                    supplierSelect.appendChild(option);
                });
                resolve(); // Resuelve la promesa después de cargar los proveedores
            })
            .catch(error => {
                console.error('Error al cargar proveedores para el modal:', error);
                reject(error); // Rechaza la promesa si ocurre un error
            });
    });
}

function loadClientsForModal() {
    return new Promise((resolve, reject) => {
        fetch('/api/clients')
            .then(response => response.json())
            .then(data => {
                const clientSelect = document.getElementById("edit_client_id");
                clientSelect.innerHTML = ""; // Limpia las opciones existentes
                data.forEach(client => {
                    const option = document.createElement("option");
                    option.value = client.id;
                    option.textContent = client.business_name;
                    clientSelect.appendChild(option);
                });
                resolve(); // Resuelve la promesa después de cargar los clientes
            })
            .catch(error => {
                console.error('Error al cargar clientes para el modal:', error);
                reject(error); // Rechaza la promesa si ocurre un error
            });
    });
}

function loadClientAddressesForModal(clientId) {
    return new Promise((resolve, reject) => {
        const addressSelect = document.getElementById("edit_client_address_id");
        addressSelect.innerHTML = ""; // Limpia las opciones existentes

        if (!clientId) {
            console.error("No se seleccionó un cliente.");
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Seleccione un cliente primero";
            addressSelect.appendChild(option);
            reject("No se seleccionó un cliente.");
            return;
        }

        fetch(`/api/client-addresses/${clientId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar direcciones del cliente: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "No hay direcciones disponibles";
                    addressSelect.appendChild(option);
                    resolve(); // Resuelve la promesa incluso si no hay direcciones
                    return;
                }

                data.forEach(address => {
                    const option = document.createElement("option");
                    option.value = address.id;
                    option.textContent = address.address;
                    addressSelect.appendChild(option);
                });

                resolve(); // Resuelve la promesa después de cargar las direcciones
            })
            .catch(error => {
                console.error("Error al cargar direcciones del cliente:", error);
                reject(error); // Rechaza la promesa si ocurre un error
            });
    });
}

function openEditModal(entryId) {
    const modal = document.getElementById("editModal");
    modal.classList.remove("hidden");

    const form = document.getElementById("editMerchandiseEntryForm");
    form.dataset.entryId = entryId;

    // Registrar el evento submit si aún no está registrado
    if (!form.dataset.eventRegistered) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que la página se recargue

            const entryId = this.dataset.entryId; // Obtén el ID de la entrada desde el atributo data
            const formData = new FormData(this); // Obtén los datos del formulario

            // Llama a la función para actualizar la entrada
            updateMerchandiseEntry(entryId, formData);
        });

        form.dataset.eventRegistered = true; // Marca el evento como registrado
    }

    fetch(`/api/merchandise-entries/${entryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener la entrada de mercancía: ${response.statusText}`);
            }
            return response.json();
        })
        .then(entry => {
            document.getElementById("edit_reception_date").value = entry.reception_date;
            document.getElementById("edit_guide_number").value = entry.guide_number;

            Promise.all([loadSuppliersForModal(), loadClientsForModal()]).then(() => {
                document.getElementById("edit_supplier_id").value = entry.supplier_id;
                document.getElementById("edit_client_id").value = entry.client_id;

                // Cargar las direcciones del cliente seleccionado
                loadClientAddressesForModal(entry.client_id).then(() => {
                    document.getElementById("edit_client_address_id").value = entry.client_address_id;
                }).catch(error => {
                    console.error("Error al cargar las direcciones del cliente para el modal:", error);
                });

                // Agregar el evento change al combobox de cliente
                const clientSelect = document.getElementById("edit_client_id");
                clientSelect.addEventListener("change", function () {
                    const clientId = this.value; // Obtén el ID del cliente seleccionado
                    loadClientAddressesForModal(clientId);
                });
            });

            document.getElementById("edit_total_weight").value = entry.total_weight;
            document.getElementById("edit_total_freight").value = entry.total_freight;
        })
        .catch(error => {
            console.error("Error al cargar los datos de la entrada de mercancía:", error);
            alert("Ocurrió un error al cargar los datos de la entrada. Por favor, inténtelo de nuevo.");
        });
}

function closeEditModal() {
    // Ocultar el modal
    const modal = document.getElementById("editModal");
    modal.classList.add("hidden");
}

function updateMerchandiseEntry(entryId, formData) {
    // Convertir FormData a un objeto JSON
    const data = Object.fromEntries(formData.entries());

    // Enviar los datos al servidor mediante una solicitud PUT
    return fetch(`/api/merchandise-entries/${entryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(result => {

            // Actualizar la tabla de entradas de mercancía
            loadMerchandiseEntries();

            // Cerrar el modal
            closeEditModal();

            // Mostrar un mensaje de éxito
            alert("Entrada de mercancía actualizada con éxito.");
        })
        .catch(error => {
            console.error("Error al actualizar la entrada de mercancía:", error);
            alert("Ocurrió un error al actualizar la entrada de mercancía. Por favor, inténtelo de nuevo.");
        });
}

function openProductModal(merchandiseEntryId) {
    // Mostrar el modal
    const modal = document.getElementById("productModal");
    modal.classList.remove("hidden");

    // Guardar el ID de la entrada de mercancía en el formulario
    const form = document.getElementById("addProductForm");
    form.dataset.merchandiseEntryId = merchandiseEntryId;

    // Cargar los productos asociados a la entrada de mercancía
    loadProductsForModal(merchandiseEntryId);
}

function closeProductModal() {
    const modal = document.getElementById("productModal");
    modal.classList.add("hidden");

    // Limpiar la lista de productos y el formulario
    document.getElementById("productList").innerHTML = "";
    document.getElementById("addProductForm").reset();
    document.getElementById("productId").value = ""; // Limpia el campo oculto
}

function loadProductsForModal(merchandiseEntryId) {
    fetch(`/api/product-entries/${merchandiseEntryId}`)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("productList");
            productList.innerHTML = ""; // Limpia la lista existente

            if (products.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No hay productos asignados.";
                productList.appendChild(li);
                return;
            }

            products.forEach(product => {
                const li = document.createElement("li");
                li.classList.add("flex", "items-center", "justify-between", "mb-2"); // Flexbox para alinear elementos
                li.innerHTML = `
                    <span class="flex-1">${product.product_name} - ${product.quantity} - ${product.type}</span>
                    <div class="flex gap-2">
                        <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm" onclick="editProduct(${product.id}, ${JSON.stringify(product.product_name).replace(/"/g, '&quot;')}, ${product.quantity}, '${product.type}')">
                            Editar
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" onclick="deleteProduct(${product.id}, ${merchandiseEntryId})">
                            Eliminar
                        </button>
                    </div>
                `;
                productList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            alert("Ocurrió un error al cargar los productos.");
        });
}

function addProductToMerchandiseEntry(merchandiseEntryId, productData) {
    console.log("Datos enviados al servidor:", productData);
    if (!productData.product_name.trim()) {
        alert("El nombre del producto es obligatorio.");
        return;
    }
    
    if (productData.quantity <= 0) {
        alert("La cantidad debe ser mayor a 0.");
        return;
    }
    // Enviar los datos al servidor
    const dataToSend = { ...productData, merchandise_entry_id: merchandiseEntryId };
    fetch('/api/product-entries', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);

            // Recargar la lista de productos
            loadProductsForModal(merchandiseEntryId);

            // Limpiar el formulario
            document.getElementById("addProductForm").reset();
        })
        .catch(error => {
            console.error("Error al agregar el producto:", error);
            alert("Ocurrió un error al agregar el producto. Por favor, inténtelo de nuevo.");
        });
}

function handleAddOrUpdateProduct() {
    const form = document.getElementById("addProductForm");
    const merchandiseEntryId = form.dataset.merchandiseEntryId;
    const productId = document.getElementById("productId").value;

    const productData = {
        product_name: document.getElementById("productName").value,
        quantity: document.getElementById("quantity").value,
        type: document.getElementById("type").value,
    };

    if (productId) {
        // Si hay un ID de producto, actualizar el producto existente
        updateProduct(productId, productData, merchandiseEntryId);
    } else {
        // Si no hay un ID de producto, agregar un nuevo producto
        addProductToMerchandiseEntry(merchandiseEntryId, productData);
    }
}

function editProduct(productId, productName, quantity, type) {
    // Cargar los datos del producto en el formulario
    document.getElementById("productId").value = productId;
    document.getElementById("productName").value = productName;
    document.getElementById("quantity").value = quantity;
    document.getElementById("type").value = type;

    // Cambiar el texto del botón para indicar que se está editando
    const submitButton = document.querySelector("#addProductForm button");
    submitButton.textContent = "Actualizar Producto";
}

function updateProduct(productId, productData, merchandiseEntryId) {
    fetch(`/api/product-entries/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Producto actualizado con éxito.");

            // Recargar la lista de productos
            loadProductsForModal(merchandiseEntryId);

            // Limpiar el formulario
            document.getElementById("addProductForm").reset();
            document.getElementById("productId").value = ""; // Limpia el campo oculto

            // Cambiar el texto del botón de nuevo a "Guardar Producto"
            const submitButton = document.querySelector("#addProductForm button");
            submitButton.textContent = "Guardar Producto";
        })
        .catch(error => {
            console.error("Error al actualizar el producto:", error);
            alert("Ocurrió un error al actualizar el producto. Por favor, inténtelo de nuevo.");
        });
}

function deleteProduct(productId, merchandiseEntryId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        return; // Si el usuario cancela, no se realiza ninguna acción
    }

    fetch(`/api/product-entries/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Producto eliminado con éxito.");

            // Recargar la lista de productos
            loadProductsForModal(merchandiseEntryId);
        })
        .catch(error => {
            console.error("Error al eliminar el producto:", error);
            alert("Ocurrió un error al eliminar el producto. Por favor, inténtelo de nuevo.");
        });
}

window.addEventListener('merchandiseEntryAssigned', () => {
    console.log('Ejecutando loadMerchandiseEntries');
    loadMerchandiseEntries(); // Recargar la tabla de entradas de mercancía
});

function filterTableM() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.querySelector('#merchandiseEntriesTable');
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const providerCell = row.querySelector('td:nth-child(3)'); // Columna de Proveedor
        const clientCell = row.querySelector('td:nth-child(4)'); // Columna de Cliente

        const providerText = providerCell ? providerCell.textContent.toLowerCase() : '';
        const clientText = clientCell ? clientCell.textContent.toLowerCase() : '';

        // Mostrar la fila si coincide con el texto de búsqueda
        if (providerText.includes(searchInput) || clientText.includes(searchInput)) {
            row.style.display = ''; // Mostrar la fila
        } else {
            row.style.display = 'none'; // Ocultar la fila
        }
    });
}

function openAssignToDispatchModal() {
    const modal = document.getElementById("assignToDispatchModal");
    modal.classList.remove("hidden");

    // Cargar los despachos disponibles
    fetch('/api/dispatches?status=available')
        .then(response => response.json())
        .then(data => {
            const dispatchSelect = document.getElementById("dispatchSelect");
            dispatchSelect.innerHTML = ""; // Limpia las opciones existentes

            data.forEach(dispatch => {
                const option = document.createElement("option");
                option.value = dispatch.id;
                option.textContent = `${dispatch.dispatch_date} - ${dispatch.driver_name}`;
                dispatchSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los despachos:', error));
}

function closeAssignToDispatchModal() {
    const modal = document.getElementById("assignToDispatchModal");
    modal.classList.add("hidden");
}

function assignSelectedEntriesToDispatch() {
    const selectedEntries = Array.from(document.querySelectorAll(".entryCheckbox:checked"))
        .map(checkbox => checkbox.value);

    if (selectedEntries.length === 0) {
        alert("Por favor, seleccione al menos un registro.");
        return;
    }

    const dispatchId = document.getElementById("dispatchSelect").value;

    fetch(`/api/dispatches/${dispatchId}/assign-bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ merchandise_entry_ids: selectedEntries }),
    })
        .then(response => response.json())
        .then(data => {
            alert("Registros asignados con éxito.");
            closeAssignToDispatchModal();
            loadMerchandiseEntries(); // Recargar la tabla de recepción
        })
        .catch(error => console.error('Error al asignar los registros:', error));
}