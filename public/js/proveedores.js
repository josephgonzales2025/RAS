// Variable global INDEPENDIENTE para la tabla DataTables de proveedores
let suppliersDataTable = null;

function loadSuppliers() {
    console.log('Cargando proveedores desde API...');
    fetch("/api/suppliers")
        .then(response => response.json())
        .then(data => {
            console.log('Datos de proveedores recibidos:', data);
            
            // Si DataTables ya está inicializado, destruirlo
            if (suppliersDataTable) {
                suppliersDataTable.destroy();
                suppliersDataTable = null;
            }

            // Limpiar la tabla
            const tableBody = document.querySelector("#suppliersTable tbody");
            tableBody.innerHTML = "";

            // Agregar los datos
            data.forEach(supplier => {
                appendSupplierRow(supplier);
            });

            // Esperar un momento para que la tabla se renderice completamente
            setTimeout(() => {
                initializeSuppliersDataTable();
            }, 200);
        })
        .catch(error => console.error('Error al cargar proveedores:', error));
}

function initializeSuppliersDataTable() {
    console.log('Inicializando DataTable ESPECÍFICO para proveedores...');
    
    // Verificar que jQuery y DataTables estén disponibles
    if (typeof $ === 'undefined') {
        console.error('jQuery no está disponible para proveedores');
        return;
    }
    
    if (typeof $.fn.DataTable === 'undefined') {
        console.error('DataTables no está disponible para proveedores');
        return;
    }
    
    try {
        suppliersDataTable = $('#suppliersTable').DataTable({
            "destroy": true,
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
            "responsive": true,
            "searching": true,
            "paging": true,
            "info": true,
            "lengthChange": false, // Ocultar el selector de registros por página como solicitaste
            "dom": '<"d-flex justify-content-start mb-3"f>rtip', // Forzar búsqueda a la izquierda con Bootstrap classes
            "columnDefs": [
                {
                    "targets": 0,
                    "orderable": true,
                    "searchable": true,
                    "className": "text-center ruc-dni-column",
                    "width": "150px"
                },
                {
                    "targets": 1,
                    "orderable": true,
                    "searchable": true,
                    "className": "uppercase",
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
            "order": [[1, 'asc']]
        });
        
        console.log('DataTable de PROVEEDORES inicializado correctamente');
        
        // Verificar que los elementos de DataTables estén presentes y hacer el input editable
        setTimeout(() => {
            const wrapper = $('#suppliersTable_wrapper');
            const searchInput = $('#suppliersTable_filter input');
            const pagination = $('#suppliersTable_paginate');
            const info = $('#suppliersTable_info');
            
            console.log('=== DIAGNÓSTICO PROVEEDORES ===');
            console.log('Wrapper encontrado:', wrapper.length > 0 ? 'SÍ' : 'NO');
            console.log('Campo de búsqueda encontrado:', searchInput.length > 0 ? 'SÍ' : 'NO');
            console.log('Paginación encontrada:', pagination.length > 0 ? 'SÍ' : 'NO');
            console.log('Info encontrada:', info.length > 0 ? 'SÍ' : 'NO');
            
            // Forzar que el input de búsqueda sea editable
            if (searchInput.length > 0) {
                searchInput.prop('readonly', false);
                searchInput.prop('disabled', false);
                searchInput.css({
                    'pointer-events': 'auto',
                    'user-select': 'text',
                    '-webkit-user-select': 'text',
                    '-moz-user-select': 'text',
                    '-ms-user-select': 'text'
                });
                searchInput.attr('placeholder', 'Buscar proveedores...');
                console.log('Input de búsqueda habilitado para proveedores');
            }
        }, 300);
        
    } catch (error) {
        console.error('Error al inicializar DataTable de proveedores:', error);
    }
}

function appendSupplierRow(supplier) {
    const tableBody = document.querySelector("#suppliersTable tbody");
    const row = document.createElement("tr");
    row.id = `supplier-row-${supplier.id}`;
    
    // Escapar caracteres especiales de forma segura
    const safeBusinessName = supplier.business_name
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
    
    row.innerHTML = `
        <td class="text-center">
            <span class="cell-ruc">${supplier.ruc_dni}</span>
        </td>
        <td class="cell-business-name">${supplier.business_name}</td>
        <td class="text-center">
            <div class="flex gap-2 justify-center">
                <button 
                    class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium flex items-center gap-1" 
                    onclick="openEditSupplierModal(${supplier.id}, '${supplier.ruc_dni}', '${safeBusinessName}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                </button>
            </div>
        </td>
    `;
    
    tableBody.appendChild(row);
}

function addSupplier() {
    const rucDni = document.getElementById("rucDni").value;
    const businessName = document.getElementById("businessName").value;

    // Validar que los campos no estén vacíos
    if (!rucDni || !businessName) {
        showErrorMessage("Por favor, complete todos los campos");
        return;
    }

    console.log('Enviando nuevo proveedor:', { ruc_dni: rucDni, business_name: businessName });

    fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: rucDni, business_name: businessName })
    })
    .then(response => {
        console.log('Respuesta del servidor:', response);
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error del servidor:', errorData);
                throw new Error(`Error HTTP ${response.status}: ${errorData.message || 'Error de validación'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor creado:', data);
        
        // Mostrar mensaje de éxito
        showSuccessMessage("Proveedor registrado con éxito");
        
        // Recargar la tabla completa para mantener DataTables sincronizado
        loadSuppliers();
        
        // Cerrar modal y limpiar formulario
        closeSupplierModal();
    })
    .catch(error => {
        console.error("Error al agregar proveedor:", error);
        showErrorMessage(`Error al agregar el proveedor: ${error.message}`);
    });
}

function openEditSupplierModal(id, rucDni, businessName) {
    document.getElementById("editSupplierId").value = id;
    document.getElementById("editRucDni").value = rucDni;
    document.getElementById("editBusinessName").value = businessName;
    
    const modal = document.getElementById("editSupplierModal");
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function updateSupplier() {
    const id = document.getElementById("editSupplierId").value;
    const newRucDni = document.getElementById("editRucDni").value;
    const newBusinessName = document.getElementById("editBusinessName").value;

    // Validar que los campos no estén vacíos
    if (!newRucDni || !newBusinessName) {
        showErrorMessage("Por favor, complete todos los campos");
        return;
    }

    console.log('Enviando actualización:', { id, ruc_dni: newRucDni, business_name: newBusinessName });

    fetch(`/api/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruc_dni: newRucDni, business_name: newBusinessName })
    })
    .then(response => {
        console.log('Respuesta del servidor:', response);
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error del servidor:', errorData);
                throw new Error(`Error HTTP ${response.status}: ${errorData.message || 'Error de validación'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor actualizado:', data);
        
        // Mostrar mensaje de éxito
        showSuccessMessage("Proveedor actualizado con éxito");
        
        // Recargar la tabla completa para mantener DataTables sincronizado
        loadSuppliers();
        
        // Cerrar modal
        closeEditSupplierModal();
    })
    .catch(error => {
        console.error("Error al actualizar proveedor:", error);
        showErrorMessage(`Error al actualizar el proveedor: ${error.message}`);
    });
}

// Funciones para manejar modales
function openSupplierModal() {
    const modal = document.getElementById("supplierModal");
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function closeSupplierModal() {
    const modal = document.getElementById("supplierModal");
    const form = document.getElementById("addSupplierForm");
    
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    form.reset();
}

function closeEditSupplierModal() {
    const modal = document.getElementById("editSupplierModal");
    const form = document.getElementById("editSupplierForm");
    
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    form.reset();
}

// Funciones para mostrar mensajes
function showSuccessMessage(message) {
    // Crear un toast de éxito
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    
    // Mostrar el toast usando transform directamente
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    // Crear un toast de error
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);
    
    // Mostrar el toast usando transform directamente
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function createToast(message, type) {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ease-in-out`;
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                ${type === 'success' 
                    ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />'
                    : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    return toast;
}

// Función de validación de RUC/DNI (reutilizada de clientes)
function validateRucDni(input) {
    // Permitir solo números
    let value = input.value.replace(/\D/g, '');
    
    // Limitar a 11 caracteres
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    input.value = value;
    
    // Validar longitud
    if (value.length !== 8 && value.length !== 11) {
        input.setCustomValidity('Debe ingresar 8 dígitos para DNI o 11 para RUC');
    } else {
        input.setCustomValidity('');
    }
}

// Función obsoleta mantenida para compatibilidad
function editSupplier(id, rucDni, businessName) {
    openEditSupplierModal(id, rucDni, businessName);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando proveedores...');
    
    // Event listeners para modales
    const openSupplierModalBtn = document.getElementById('openSupplierModalBtn');
    if (openSupplierModalBtn) {
        openSupplierModalBtn.addEventListener('click', openSupplierModal);
    }
    
    const closeSupplierModalBtn = document.getElementById('closeSupplierModalBtn');
    if (closeSupplierModalBtn) {
        closeSupplierModalBtn.addEventListener('click', closeSupplierModal);
    }
    
    const closeEditSupplierModalBtn = document.getElementById('closeEditSupplierModalBtn');
    if (closeEditSupplierModalBtn) {
        closeEditSupplierModalBtn.addEventListener('click', closeEditSupplierModal);
    }
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditSupplierModal);
    }
    
    // Event listeners para formularios
    const addSupplierForm = document.getElementById('addSupplierForm');
    if (addSupplierForm) {
        addSupplierForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addSupplier();
        });
    }
    
    const editSupplierForm = document.getElementById('editSupplierForm');
    if (editSupplierForm) {
        editSupplierForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateSupplier();
        });
    }
    
    // Cargar proveedores al inicio
    loadSuppliers();
});

function filterSuppliers() {
    // Esta función ya no es necesaria con DataTables, pero se mantiene para compatibilidad
    if (suppliersDataTable) {
        const searchValue = document.getElementById("searchInput") ? document.getElementById("searchInput").value : '';
        suppliersDataTable.search(searchValue).draw();
    }
}