// Verificar token CSRF al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
        console.error('⚠️ TOKEN CSRF NO ENCONTRADO EN EL DOM');
    } else {
        console.log('✅ Token CSRF encontrado:', csrfToken.getAttribute('content').substring(0, 20) + '...');
    }
});

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
                        <button class="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600" onclick="loadAssignedEntriesPDF(${dispatch.id }, '${dispatch.dispatch_date}')">Exportar PDF</button>
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
            tableBody.innerHTML = '';

            if (!data.merchandise_entries || data.merchandise_entries.length === 0) {
                // Mensaje si no hay registros
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border border-gray-300 px-4 py-2 text-center" colspan="8">No hay registros asignados</td>
                `;
                tableBody.appendChild(row);
            } else {
                // Ordena los registros: primero por zona, luego por cliente
                const sortedEntries = data.merchandise_entries.sort((a, b) => {
                    const zoneA = a.client_address.zone.toLowerCase();
                    const zoneB = b.client_address.zone.toLowerCase();
                    const clientA = a.client.business_name.toLowerCase();
                    const clientB = b.client.business_name.toLowerCase();

                    if (zoneA < zoneB) return -1;
                    if (zoneA > zoneB) return 1;
                    return clientA.localeCompare(clientB); // Si las zonas son iguales, ordena por cliente
                });

                // Renderiza los registros ordenados
                sortedEntries.forEach(entry => {
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

    console.log('📤 Obteniendo cookie CSRF de Sanctum...');

    // Primero, obtener la cookie CSRF de Sanctum
    fetch('/sanctum/csrf-cookie', {
        credentials: 'same-origin'
    })
    .then(() => {
        console.log('✅ Cookie CSRF obtenida');
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        
        if (!csrfToken) {
            console.error('⚠️ ERROR: No se encuentra el token CSRF en el DOM');
            alert('Error: Token CSRF no encontrado. Por favor, recarga la página.');
            return Promise.reject('No CSRF token');
        }

        const tokenValue = csrfToken.getAttribute('content');
        console.log('📤 Enviando petición POST a /api/dispatches/' + dispatchId + '/assign');
        console.log('🔑 Token CSRF:', tokenValue.substring(0, 20) + '...');

        return fetch(`/api/dispatches/${dispatchId}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': tokenValue,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                merchandise_entry_id: merchandiseEntryId
            }),
            credentials: 'same-origin'
        });
    })
    .then(response => {
        console.log('📥 Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('❌ Error del servidor:', text);
                throw new Error(`HTTP error! status: ${response.status} - ${text.substring(0, 100)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Éxito:', data);
        alert('Registro asignado con éxito');
        loadAssignedEntries(dispatchId);
        loadAvailableMerchandiseEntries();
        localStorage.setItem('reloadMerchandiseEntries', 'true');
    })
    .catch(error => {
        console.error('💥 Error al asignar el registro:', error);
        alert('Error al asignar el registro: ' + error.message);
    });
}

function removeAssignedEntry(dispatchId, merchandiseEntryId) {
    console.log('📤 Obteniendo cookie CSRF de Sanctum...');

    // Primero, obtener la cookie CSRF de Sanctum
    fetch('/sanctum/csrf-cookie', {
        credentials: 'same-origin'
    })
    .then(() => {
        console.log('✅ Cookie CSRF obtenida');
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        
        if (!csrfToken) {
            console.error('⚠️ ERROR: No se encuentra el token CSRF en el DOM');
            alert('Error: Token CSRF no encontrado. Por favor, recarga la página.');
            return Promise.reject('No CSRF token');
        }

        const tokenValue = csrfToken.getAttribute('content');
        console.log('📤 Enviando petición DELETE a /api/dispatches/' + dispatchId + '/remove/' + merchandiseEntryId);
        console.log('🔑 Token CSRF:', tokenValue.substring(0, 20) + '...');

        return fetch(`/api/dispatches/${dispatchId}/remove/${merchandiseEntryId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': tokenValue,
                'Accept': 'application/json',
            },
            credentials: 'same-origin'
        });
    })
    .then(async response => {
        console.log('📥 Respuesta recibida:', response.status, response.statusText);
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            console.error('❌ Error en la respuesta:', response.status);
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
        console.error('💥 Error de red o al eliminar el registro:', error);
        alert('No se pudo eliminar el registro: ' + error.message);
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
        const zoneCell = row.querySelector('td:nth-child(5)'); // Columna de Zona

        const providerText = providerCell ? providerCell.textContent.toLowerCase() : '';
        const clientText = clientCell ? clientCell.textContent.toLowerCase() : '';
        const zoneText = zoneCell ? zoneCell.textContent.toLowerCase() : '';

        // Mostrar la fila si coincide con el texto de búsqueda
        if (providerText.includes(searchInput) || clientText.includes(searchInput) || zoneText.includes(searchInput)) {
            row.style.display = ''; // Mostrar la fila
        } else {
            row.style.display = 'none'; // Ocultar la fila
        }
    });
}

function loadAssignedEntriesPDF(dispatchId, dispatchDate) {
    fetch(`/api/dispatches/${dispatchId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.merchandise_entries || data.merchandise_entries.length === 0) {
                alert("No hay registros asignados para este despacho.");
                return;
            }

            // Ordenar los registros por zona
            const sortedEntries = data.merchandise_entries.sort((a, b) => {
                const zoneA = a.client_address.zone.toLowerCase();
                const zoneB = b.client_address.zone.toLowerCase();
                if (zoneA < zoneB) return -1;
                if (zoneA > zoneB) return 1;
                return 0; // Si las zonas son iguales, no cambiar el orden
            });

            // Crea un nuevo documento PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Título
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Despacho de mercadería", 105, 20, null, null, "center");

            // Configura la tabla
            const headers = ["Fecha de Recepción", "Número de Guía", "Proveedor", "Cliente", "Zona", "Peso Total (kg)"];
            const rows = data.merchandise_entries.map(entry => [
                entry.reception_date,
                entry.guide_number,
                entry.supplier.business_name,
                entry.client.business_name,
                entry.client_address.zone,
                `${entry.total_weight} kg`
            ]);

            // Establece las columnas y las filas en el PDF
            doc.autoTable({
                head: [headers],
                body: rows,
                startY: 30, // Y-coordinate of the start of the table
                theme: 'grid', // Estilo de tabla
                headStyles: { fillColor: [100, 100, 100] }, // Color de fondo de los encabezados
            });

            // Formatear la fecha del despacho para usarla en el nombre del archivo
            const formattedDate = dispatchDate.replace(/-/g, '_'); // Reemplazar guiones por guiones bajos


            // Genera el archivo PDF y lo abre en una nueva ventana
            doc.save(`despacho_${formattedDate}.pdf`);
        })
        .catch(error => {
            console.error("Error al cargar los registros asignados:", error);
        });
}
