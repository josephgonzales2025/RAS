// Función para cargar los despachos en la tabla
function loadDispatches() {
    fetch('/api/dispatches')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('dispatchTableBody');
            tableBody.innerHTML = ''; // Limpia la tabla antes de cargar los datos

            data.forEach(dispatch => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border border-gray-300 px-4 py-2">${dispatch.id}</td>
                    <td class="border border-gray-300 px-4 py-2">${dispatch.dispatch_date}</td>
                    <td class="border border-gray-300 px-4 py-2">${dispatch.driver_name}</td>
                    <td class="border border-gray-300 px-4 py-2">${dispatch.transport_company_name}</td>
                    <td class="border border-gray-300 px-4 py-2">${dispatch.transport_company_ruc}</td>
                    <td class="border border-gray-300 px-4 py-2">
                        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onclick="openAssignModal(${dispatch.id})">Ver Registros</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los despachos:', error));
}

function openAssignModal(dispatchId) {
    document.getElementById('assignModal').classList.remove('hidden');
    document.getElementById('assignModal').dataset.dispatchId = dispatchId;

    // Cargar los números de guía disponibles
    loadAvailableMerchandiseEntries();

    // Cargar los registros asignados al despacho
    loadAssignedEntries(dispatchId);
}

function closeAssignModal() {
    document.getElementById('assignModal').classList.add('hidden');
    document.getElementById('assignModal').dataset.dispatchId = '';
}

function loadAvailableMerchandiseEntries() {
    fetch('/api/merchandise-entries?status=pending')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('merchandiseEntrySelect');
            select.innerHTML = ''; // Limpia las opciones existentes

            if (data.length === 0) {
                // Si no hay registros, muestra un mensaje en el combobox
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay registros disponibles';
                select.appendChild(option);
                select.disabled = true; // Desactiva el combobox
            } else {

                // Ordenar los datos por zona (alfabéticamente)
                data.sort((a, b) => {
                    const zoneA = a.client_address.zone.toUpperCase();
                    const zoneB = b.client_address.zone.toUpperCase();
                    return zoneA.localeCompare(zoneB);
                });

                // Si hay registros, los agrega al combobox
                data.forEach(entry => {
                    const option = document.createElement('option');
                    option.value = entry.id;
                    option.textContent = `${entry.guide_number} - ${entry.client.business_name} - ${entry.client_address.zone}`;
                    select.appendChild(option);
                });
                select.disabled = false; // Activa el combobox
            }
        })
        .catch(error => console.error('Error al cargar los números de guía:', error));
}

function loadAssignedEntries(dispatchId) {
    fetch(`/api/dispatches/${dispatchId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('assignedEntriesTableBody');
            tableBody.innerHTML = ''; // Limpia la tabla antes de cargar los datos

            if (!data.merchandise_entries || data.merchandise_entries.length === 0) {
                // Si no hay registros asignados, muestra un mensaje en la tabla
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border border-gray-300 px-4 py-2 text-center" colspan="3">No hay registros asignados</td>
                `;
                tableBody.appendChild(row);
            } else {
                // Si hay registros asignados, los muestra en la tabla
                data.merchandise_entries.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="border border-gray-300 px-4 py-2">${entry.reception_date}</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.guide_number}</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.supplier.business_name}</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.client.business_name}</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.client_address.zone}</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.total_weight} kg</td>
                        <td class="border border-gray-300 px-4 py-2">${entry.total_freight}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <div class="flex gap-2 justify-center">
                                <button class="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600" onclick="openProductModalD(${entry.id})">Ver Productos</button>
                                <button class="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600" onclick="removeAssignedEntry(${dispatchId}, ${entry.id})">Eliminar</button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error al cargar los registros asignados:', error));
}

function assignMerchandiseEntry() {
    const dispatchId = document.getElementById('assignModal').dataset.dispatchId;
    const merchandiseEntryId = document.getElementById('merchandiseEntrySelect').value;

    fetch(`/api/dispatches/${dispatchId}/assign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ merchandise_entry_id: merchandiseEntryId }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Registro asignado con éxito');
            loadAssignedEntries(dispatchId); // Recargar los registros asignados
            loadAvailableMerchandiseEntries(); // Recargar los números de guía disponibles
            
            // Guardar un indicador en localStorage
            localStorage.setItem('reloadMerchandiseEntries', 'true');
        })
        .catch(error => console.error('Error al asignar el registro:', error));
}

function removeAssignedEntry(dispatchId, merchandiseEntryId) {
    fetch(`/api/dispatches/${dispatchId}/remove/${merchandiseEntryId}`, {
        method: 'DELETE',
    })
        .then(async response => {
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                // Si es JSON, mostrar el mensaje del backend
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Error desconocido'}`);
                    console.error("Detalles:", errorData);
                }
                // Si viene HTML (por ejemplo, un error del servidor como 500)
                else if (contentType && contentType.includes("text/html")) {
                    const errorHtml = await response.text();
                    console.error("Error HTML recibido:", errorHtml);
                    alert("Ocurrió un error interno del servidor (500)");
                }
                // Otros tipos de contenido no esperados
                else {
                    const errorText = await response.text();
                    console.error("Respuesta no esperada:", errorText);
                    alert("Error inesperado al procesar la solicitud.");
                }

                return;
            }

            // Si fue exitoso
            const data = await response.json();
            alert(data.message);
            loadAssignedEntries(dispatchId);
            loadAvailableMerchandiseEntries();
        })
        .catch(error => {
            console.error('Error de red o al eliminar el registro:', error);
            alert('No se pudo eliminar el registro (error de red o servidor)');
        });
}

function openProductModalD(merchandiseEntryId) {
    // Mostrar el modal
    const modal = document.getElementById("productModal");
    modal.classList.remove("hidden");

    // Cargar los productos asociados a la entrada de mercancía
    loadProductsForModalD(merchandiseEntryId);
}

function closeProductModalD() {
    const modal = document.getElementById("productModal");
    modal.classList.add("hidden");

    // Limpiar la lista de productos
    document.getElementById("productList").innerHTML = "";
}

function loadProductsForModalD(merchandiseEntryId) {
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
                `;
                productList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            alert("Ocurrió un error al cargar los productos.");
        });
}

function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.querySelector('#assignedEntriesTableBody');
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