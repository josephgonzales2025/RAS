function loadSuppliers() {
    fetch("/api/suppliers")  // Llama a la API
        .then(response => response.json())
        .then(data => {
            let tableBody = document.querySelector("#suppliersTable tbody");
            tableBody.innerHTML = "";

            data.forEach(supplier => {
                appendSupplierRow(supplier);
            });
        });
}

function appendSupplierRow(supplier) {
    let tableBody = document.querySelector("#suppliersTable tbody");
    let row = document.createElement("tr");
    row.id = `row-${supplier.id}`;
    row.setAttribute("data-supplier-name", supplier.business_name.toLowerCase()); // Agrega el atributo para el filtro
    row.innerHTML = `
        <td class='border p-2'>${supplier.id}</td>
        <td class='border p-2'>${supplier.ruc_dni}</td>
        <td class='border p-2'>${supplier.business_name}</td>
        <td class='border p-2'>
            <a href="#" class="bg-blue-700 text-white p-1 rounded" onclick="editSupplier(${supplier.id}, '${supplier.ruc_dni}', '${supplier.business_name.replace(/'/g, "\\'")}')">Editar</a>
        </td>
    `;
    tableBody.appendChild(row);
}

function addSuppliers() {
    let rucDni = document.getElementById("rucDni").value;
    let businessName = document.getElementById("businessName").value;

    fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: rucDni, business_name: businessName })
    })
    .then(response => response.json())
    .then(data => {
        alert("Proveedor registrado con éxito.")
        appendSupplierRow(data); // Agrega el nuevo proveedor a la tabla
        document.getElementById("addSupplierForm").reset();
    })
    .catch(error => {
        console.error("Error al agregar proveedor:", error);

        // Mostrar mensaje de error
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.textContent = "Error al agregar el proveedor.";
        messageContainer.classList.remove("hidden");
        messageContainer.classList.add("bg-red-100", "text-red-800");

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            messageContainer.classList.add("hidden");
        }, 3000);
    });
}

function editSupplier(id, rucDni, businessName) {
    let newrucDni = prompt("Editar ruc o dni", rucDni);
    let newBusinessName = prompt("Editar Razón Social", businessName);
    if (newBusinessName !== null && newrucDni !== null) {
        fetch(`/api/suppliers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ruc_dni:newrucDni, business_name: newBusinessName })
        })
        .then(response => response.json())
        .then(data => {
            // Actualiza la celda del nombre del proveedor (Razón Social)
            document.querySelector(`#row-${id} td:nth-child(3)`).textContent = newBusinessName;

            // Actualiza la celda del RUC/DNI
            document.querySelector(`#row-${id} td:nth-child(2)`).textContent = newrucDni;
        })
        .catch(error => console.error("Error al actualizar proveedor:", error));
    }
}

function filterSuppliers() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const supplierRows = document.querySelectorAll("#suppliersTable tbody tr");

    supplierRows.forEach(row => {
        const supplierName = row.getAttribute("data-supplier-name");
        if (supplierName.includes(searchInput)) {
            row.style.display = ""; // Muestra la fila si coincide
        } else {
            row.style.display = "none"; // Oculta la fila si no coincide
        }
    });
}