document.addEventListener("DOMContentLoaded", function () {
    // Inicializa Select2 en los campos de proveedor y cliente
    $('#supplier_id').select2({
        placeholder: "Seleccione un proveedor",
        allowClear: true
    });

    $('#client_id').select2({
        placeholder: "Seleccione un cliente",
        allowClear: true
    });
});

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

function loadMerchandiseEntries() {
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
                `;
                tableBody.appendChild(row);
            });
            
        })
        .catch(error => console.error('Error al cargar las entradas de mercancía:', error));
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