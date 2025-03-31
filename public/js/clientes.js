function loadClients() {
    fetch("/api/clients")  // Llama a la API
        .then(response => response.json())
        .then(data => {
            let tableBody = document.querySelector("#clientsTable tbody");
            tableBody.innerHTML = "";

            data.forEach(client => {
                appendClientRow(client);
            });
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
    row.setAttribute("data-client-name", client.business_name.toLowerCase()); // Agrega el atributo para el filtro
    row.innerHTML = `
        <td class='border p-2'>${client.id}</td>
        <td class='border p-2'>${client.ruc_dni}</td>
        <td class='border p-2'>${client.business_name}</td>
        <td class='border p-2'>
            <a href="#" class="bg-blue-700 text-white p-1 rounded" onclick="editClient(${client.id}, '${client.ruc_dni}', '${client.business_name}')">Editar</a> |
            <button class="bg-green-700 text-white p-1 rounded" onclick="showAddressForm(${client.id})">Añadir Dirección</button>
            <button class="bg-purple-700 text-white p-1 rounded" onclick="loadAddresses(${client.id})">Ver Direcciones</button>
            <div id="addressForm-${client.id}" class="hidden mt-2">
                <input type="text" id="address-${client.id}" placeholder="Dirección" class="border p-1">
                <input type="text" id="zone-${client.id}" placeholder="Zona" class="border p-1">
                <button class="bg-green-500 text-white p-1" onclick="addAddress(${client.id})">Guardar</button>
            </div>
            <div id="addressList-${client.id}" class="hidden mt-2"></div>
        </td>
    `;
    tableBody.appendChild(row);
}

function addClient() {
    let rucDni = document.getElementById("rucDni").value;
    let businessName = document.getElementById("businessName").value;

    fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: rucDni, business_name: businessName })
    })
    .then(response => response.json())
    .then(data => {
        appendClientRow(data); // Agrega el nuevo cliente a la tabla
        document.getElementById("addClientForm").reset();
    })
    .catch(error => console.error("Error al agregar cliente:", error));
}

function editClient(id, rucDni, businessName) {
    let newrucDni = prompt("Editar ruc o dni", rucDni);
    let newBusinessName = prompt("Editar Razón Social", businessName);
    if (newBusinessName !== null) {
        fetch(`/api/clients/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ruc_dni:newrucDni, business_name: newBusinessName })
        })
        .then(response => response.json())
        .then(data => {
            alert("Cliente registrado con éxito.");
            document.querySelector(`#row-${id} td:nth-child(3)`).textContent = newBusinessName;
            // Actualiza la celda del RUC/DNI
            document.querySelector(`#row-${id} td:nth-child(2)`).textContent = newrucDni;
        })
        .catch(error => console.error("Error al actualizar cliente:", error));
    }
}

function showAddressForm(clientId) {
    document.getElementById(`addressForm-${clientId}`).classList.toggle("hidden");
}

function addAddress(clientId) {
    let address = document.getElementById(`address-${clientId}`).value;
    let zone = document.getElementById(`zone-${clientId}`).value;
    
    fetch("/api/client-addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({client_id:clientId, address: address, zone: zone })
    })
    .then(response => response.json())
    .then(data => {
        alert("Dirección añadida correctamente");
        document.getElementById(`addressForm-${clientId}`).classList.add("hidden");
        loadAddresses(clientId);
    })
    .catch(error => console.error("Error al agregar dirección:", error));
}
function loadAddresses(clientId) {
    const addressList = document.getElementById(`addressList-${clientId}`);

    // Verifica si el contenedor ya está visible
    if (!addressList.classList.contains("hidden")) {
        // Si está visible, lo ocultamos
        addressList.classList.add("hidden");
        return;
    }

    // Si está oculto, cargamos las direcciones y lo mostramos
    const url = `/api/client-addresses/${clientId}`;
    console.log("URL generada:", url); // Para depuración

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            addressList.innerHTML = "<h3 class='font-bold'>Direcciones:</h3>";

            // Si la respuesta contiene un mensaje (caso de error o sin direcciones)
            if (data.message) {
                addressList.innerHTML += `
                    <p class="text-gray-500">${data.message}</p>
                `;
            }
            // Si la respuesta es un array de direcciones
            else if (Array.isArray(data) && data.length > 0) {
                data.forEach(address => {
                    addressList.innerHTML += `
                        <div class="flex items-center justify-between">
                            <p>${address.address} - ${address.zone}</p>
                            <div>
                                <button class="text-blue-700" onclick="editAddress(${address.id}, '${address.address}', '${address.zone}')">Editar</button>
                            </div>
                        </div>
                    `;
                });
            }
            // Si no hay direcciones (caso extremo, aunque no debería ocurrir)
            else {
                addressList.innerHTML += "<p>No hay direcciones disponibles.</p>";
            }

            // Muestra el contenedor de direcciones
            addressList.classList.remove("hidden");
        })
        .catch(error => console.error("Error al cargar direcciones:", error));
}
function editAddress(addressId, currentAddress, currentZone) {
    console.log("ID de la dirección:", addressId); // Verifica el ID
    const newAddress = prompt("Editar Dirección:", currentAddress);
    const newZone = prompt("Editar Zona:", currentZone);

    if (newAddress !== null && newZone !== null) {
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
            // Recargar las direcciones del cliente
            const clientId = data.client_id; // Asegúrate de que el servidor devuelva el `client_id`
            loadAddresses(clientId);
        })
        .catch(error => console.error("Error al editar dirección:", error));
    }
}

function filterClients() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const clientRows = document.querySelectorAll("#clientsTable tbody tr");

    clientRows.forEach(row => {
        const clientName = row.getAttribute("data-client-name");
        if (clientName.includes(searchInput)) {
            row.style.display = ""; // Muestra la fila si coincide
        } else {
            row.style.display = "none"; // Oculta la fila si no coincide
        }
    });
}