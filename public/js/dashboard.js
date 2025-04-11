function initializeDashboard() {
    const zoneFilter = document.getElementById("zoneFilter");
    const dashboardTableBody = document.querySelector("#dashboardTable tbody");
    const totalWeightElement = document.getElementById("dashboardTotalWeight");
    const totalFreightElement = document.getElementById("dashboardTotalFreight");

    function loadDashboardData() {
        fetch('/api/merchandise-entries')
            .then(response => response.json())
            .then(data => {
                let totalWeight = 0;
                let totalFreight = 0;
    
                // Procesar los datos
                const zones = {};
                data.forEach(entry => {
                    const zone = entry.client_address ? entry.client_address.zone : "Sin Zona";
                    if (!zones[zone]) {
                        zones[zone] = { totalWeight: 0, totalFreight: 0 };
                    }
                    zones[zone].totalWeight += parseFloat(entry.total_weight);
                    zones[zone].totalFreight += parseFloat(entry.total_freight);
    
                    totalWeight += parseFloat(entry.total_weight);
                    totalFreight += parseFloat(entry.total_freight);
                });
    
                // Actualizar el resumen
                totalWeightElement.textContent = `${totalWeight.toFixed(2)} kg`;
                totalFreightElement.textContent = `${totalFreight.toFixed(2)}`;
    
                // Actualizar la tabla
                dashboardTableBody.innerHTML = "";
                Object.keys(zones).forEach(zone => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="border p-2">${zone}</td>
                        <td class="border p-2">${zones[zone].totalWeight.toFixed(2)} kg</td>
                        <td class="border p-2">${zones[zone].totalFreight.toFixed(2)}</td>
                    `;
                    dashboardTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error al cargar los datos del dashboard:", error));
    }

    function loadDispatches() {
        fetch('/api/dispatches')
            .then(response => response.json())
            .then(data => {
                const dispatchFilter = document.getElementById('dispatchFilter');
                dispatchFilter.innerHTML = '<option value="">Seleccione un Despacho</option>';
                data.forEach(dispatch => {
                    const option = document.createElement('option');
                    option.value = dispatch.id;
                    option.textContent = `Despacho ${dispatch.id} - ${dispatch.dispatch_date} (${dispatch.driver_name})`;
                    dispatchFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar los despachos:', error));
    }

    function loadDispatchClients() {
        const dispatchId = document.getElementById('dispatchFilter').value;
    
        if (!dispatchId) {
            // Si no hay un despacho seleccionado, limpia el filtro de clientes
            const clientFilter = document.getElementById('clientFilter');
            clientFilter.innerHTML = '<option value="">Todos los Clientes</option>';
            return;
        }
    
        fetch(`/api/dispatches/${dispatchId}/clients`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('La respuesta no es un array:', data);
                    return;
                }
    
                const clientFilter = document.getElementById('clientFilter');
                clientFilter.innerHTML = '<option value="">Todos los Clientes</option>';
                data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.client_id;
                    option.textContent = client.business_name;
                    clientFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    }

    // Cargar los datos al inicio
    loadDashboardData();

    // Cargar los despachos al inicio
    loadDispatches();

    // Cargar los totales segun despacho
    fetchDispatchTotals();

    // Ejecutar loadDispatchClients solo cuando cambie el despacho
    document.getElementById('dispatchFilter').addEventListener('change', () => {
        loadDispatchClients();
        fetchDispatchTotals(); // También actualiza los totales al cambiar el despacho
    });

}

function fetchDispatchTotals() {
    const dispatchId = document.getElementById('dispatchFilter').value;
    const clientId = document.getElementById('clientFilter').value;

    if (!dispatchId) {
        // Si no se selecciona un despacho, limpia los totales
        document.getElementById('totalWeight').textContent = '0.00 kg';
        document.getElementById('totalFreight').textContent = '0.00';
        return;
    }

    fetch(`/api/dispatches/${dispatchId}/totals?client_id=${clientId}`)
        .then(response => response.json())
        .then(data => {
            const totalWeight = parseFloat(data.total_weight) || 0;
            const totalFreight = parseFloat(data.total_freight) || 0;

            document.getElementById('totalWeight').textContent = `${totalWeight.toFixed(2)} kg`;
            document.getElementById('totalFreight').textContent = `${totalFreight.toFixed(2)}`;
        })
        .catch(error => console.error('Error al obtener los totales:', error));
}

