document.addEventListener("DOMContentLoaded", function () {
    // Inicializa Select2 en los campos de proveedor y cliente solo si existen
    if ($('#supplier_id').length) {
        $('#supplier_id').select2({
            placeholder: "Seleccione un proveedor",
            allowClear: true
        });
    }

    if ($('#client_id').length) {
        $('#client_id').select2({
            placeholder: "Seleccione un cliente",
            allowClear: true
        });
    }

    // Inicializar DataTable si la tabla existe
    if ($('#merchandiseEntriesTable').length) {
        loadMerchandiseEntries();
    }
});

// Función para configurar el modal de entrada
function setupEntryModal() {
    // Esta función maneja la configuración del modal si existe
    // Si no existe, simplemente no hace nada para evitar errores
    const modal = document.getElementById('entryModal');
    const openModalBtn = document.getElementById('openEntryModalBtn');
    const closeModalBtn = document.getElementById('closeEntryModalBtn');

    // Si no existen los elementos del modal, simplemente retorna sin error
    if (!modal || !openModalBtn || !closeModalBtn) {
        console.info('Modal de entrada no encontrado - usando formulario directo');
        return;
    }

    // Abrir modal
    openModalBtn.addEventListener('click', function () {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', function () {
        closeEntryModal();
    });

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function (e) {
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

// Variable global para el DataTable
let merchandiseTable;

function loadMerchandiseEntries() {
    // Si el DataTable ya existe, destruirlo
    if (merchandiseTable) {
        merchandiseTable.destroy();
    }

    // Inicializar DataTable
    merchandiseTable = $('#merchandiseEntriesTable').DataTable({
        ajax: {
            url: '/api/merchandise-entries',
            dataSrc: '',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        },
        columns: [
            {
                data: 'reception_date',
                render: function (data) {
                    return new Date(data).toLocaleDateString('es-ES');
                }
            },
            { data: 'guide_number' },
            {
                data: 'supplier',
                render: function (data) {
                    return data ? data.business_name : 'N/A';
                }
            },
            {
                data: 'client',
                render: function (data) {
                    return data ? data.business_name : 'N/A';
                }
            },
            /*{
                data: 'client_address',
                render: function (data) {
                    return data ? data.address : 'N/A';
                }
            },*/
            {
                data: 'client_address',
                render: function (data) {
                    return data ? data.zone : 'N/A';
                }
            },
            {
                data: 'total_weight',
                render: function (data) {
                    return data + ' kg';
                }
            },
            {
                data: 'total_freight',
                render: function (data) {
                    return 'S/ ' + parseFloat(data).toFixed(2);
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <div class="flex gap-2 justify-center">
                            <button class="action-button action-button-edit text-xs px-2 py-1" onclick="openEditModal(${row.id})">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button class="action-button action-button-products text-xs px-2 py-1" onclick="openProductModal(${row.id})">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </button>
                            <button class="action-button action-button-delete text-xs px-2 py-1" onclick="openDeleteModal(${row.id}, '${row.guide_number}', '${row.client ? row.client.business_name : 'N/A'}', '${row.supplier ? row.supplier.business_name : 'N/A'}')">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `<input type="checkbox" class="entryCheckbox rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" value="${row.id}">`;
                }
            }
        ],

        order: [[0, 'desc']],
        language: {
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
        responsive: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        lengthChange: false,
        dom: '<"flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4"<"mb-4 lg:mb-0"l><"mb-4 lg:mb-0"f>>rtip',
        drawCallback: function () {
            // Reajustar estilos después de cada draw
            this.api().tables().nodes().to$().removeClass('table table-striped table-bordered');
        },
        initComplete: function () {
            // Personalizar el mensaje de "No hay datos"
            $('.dataTables_empty').html(`
                <div class="flex flex-col items-center justify-center text-gray-500 py-12">
                    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="text-lg font-medium text-gray-400">No hay entradas registradas</p>
                    <p class="text-sm text-gray-400 mt-1">Las entradas de mercadería aparecerán aquí una vez que las agregues</p>
                </div>
            `);
        }
    });
}

function toggleSelectAll(selectAllCheckbox) {
    // Seleccionar todos los checkboxes visibles en la página actual de DataTables
    const checkboxes = document.querySelectorAll("#merchandiseEntriesTable .entryCheckbox");
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Función para enviar el formulario (alias de addMerchandiseEntry)
function submitEntryForm() {
    addMerchandiseEntry();
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
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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
            showSuccessMessage("Entrada de mercancía agregada con éxito.");
            const modal = document.getElementById('addEntryModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
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
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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
            showSuccessMessage("Entrada de mercancía actualizada con éxito.");
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
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
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

// Funciones para el modal de nueva entrada
function openAddEntryModal() {
    const modal = document.getElementById('addEntryModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        // Limpiar el formulario
        const form = document.getElementById('addMerchandiseEntryForm');
        if (form) {
            form.reset();
        }

        // Recargar datos de proveedores y clientes
        loadSuppliers();
        loadClients();
    }
}

function closeAddEntryModal() {
    const modal = document.getElementById('addEntryModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');

        // Limpiar el formulario
        const form = document.getElementById('addMerchandiseEntryForm');
        if (form) {
            form.reset();
        }
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeAddEntryModal();
    }
});

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', function (event) {
    const modal = document.getElementById('addEntryModal');
    if (modal && event.target === modal) {
        closeAddEntryModal();
    }
});

// Variable global para almacenar el ID de la entrada a eliminar
let entryToDelete = null;

// Función para abrir el modal de confirmación de eliminación
function openDeleteModal(entryId, guideNumber, clientName, supplierName) {
    entryToDelete = entryId;

    // Actualizar los datos en el modal
    document.getElementById('delete_guide_number').textContent = guideNumber;
    document.getElementById('delete_client_name').textContent = clientName;
    document.getElementById('delete_supplier_name').textContent = supplierName;

    // Mostrar el modal
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// Función para cerrar el modal de confirmación de eliminación
function closeDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    entryToDelete = null;
}

// Función para confirmar y ejecutar la eliminación
function confirmDelete() {
    if (!entryToDelete) {
        console.error('No hay entrada seleccionada para eliminar');
        return;
    }

    // Llamar a la API para eliminar la entrada
    fetch(`/api/merchandise-entries/${entryToDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
            return response.json();
        })
        .then(data => {
            // Cerrar el modal
            closeDeleteModal();

            // Mostrar mensaje de éxito
            showSuccessMessage('Entrada de mercadería eliminada con éxito.');

            // Recargar la tabla
            loadMerchandiseEntries();
        })
        .catch(error => {
            console.error('Error al eliminar la entrada de mercadería:', error);
            alert('Ocurrió un error al eliminar la entrada de mercadería. Por favor, inténtelo de nuevo.');
            closeDeleteModal();
        });
}

// Cerrar modal de eliminación con tecla Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal && !deleteModal.classList.contains('hidden')) {
            closeDeleteModal();
        }
    }
});