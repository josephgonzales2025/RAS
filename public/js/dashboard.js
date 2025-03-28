function initializeDashboard() {
    const zoneFilter = document.getElementById("zoneFilter");
    const dashboardTableBody = document.querySelector("#dashboardTable tbody");
    const totalWeightElement = document.getElementById("dashboardTotalWeight");
    const totalFreightElement = document.getElementById("dashboardTotalFreight");

    function loadDashboardData() {
        fetch('/api/merchandise-entries')
            .then(response => response.json())
            .then(data => {
                const selectedZone = zoneFilter.value;
                let totalWeight = 0;
                let totalFreight = 0;

                // Filtrar y procesar los datos
                const filteredData = data.filter(entry => {
                    if (selectedZone && entry.client_address && entry.client_address.zone !== selectedZone) {
                        return false;
                    }
                    totalWeight += parseFloat(entry.total_weight);
                    totalFreight += parseFloat(entry.total_freight);
                    return true;
                });

                // Actualizar el resumen
                totalWeightElement.textContent = `${totalWeight.toFixed(2)} kg`;
                totalFreightElement.textContent = `${totalFreight.toFixed(2)}`;

                // Actualizar la tabla
                dashboardTableBody.innerHTML = "";
                const zones = {};

                filteredData.forEach(entry => {
                    const zone = entry.client_address ? entry.client_address.zone : "Sin Zona";
                    if (!zones[zone]) {
                        zones[zone] = { totalWeight: 0, totalFreight: 0 };
                    }
                    zones[zone].totalWeight += parseFloat(entry.total_weight);
                    zones[zone].totalFreight += parseFloat(entry.total_freight);
                });

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

    // Cargar los datos al inicio
    loadDashboardData();

    // Recargar los datos cuando se cambie el filtro
    zoneFilter.addEventListener("change", loadDashboardData);
}