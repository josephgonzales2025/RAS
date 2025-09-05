@extends('layouts.app')

@section('title', 'Sistema RAS')

@section('content')
    <div id="mainContent" class="p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-4 text-center sm:text-left">Bienvenido</h1>
        <p class="text-gray-700 text-center sm:text-left">
            Selecciona una opción del menú para comenzar.
        </p>
    </div>
@endsection

@section('scripts')
    <!-- Font Awesome para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Incluye jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

    <!-- DataTables CSS y JS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.bootstrap5.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css">
    
    <script type="text/javascript" src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.bootstrap5.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/responsive/2.5.0/js/responsive.bootstrap5.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>

    <!-- Incluye Select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.13/jspdf.plugin.autotable.min.js"></script>
    <script src="{{ asset('js/dashboard.js') }}"></script>
    <script src="{{ asset('js/clientes.js') }}"></script>
    <script src="{{ asset('js/proveedores.js')}}"></script>
    <script src="{{ asset('js/entradas_mercaderias.js') }}"></script>
    <script src="{{ asset('js/despachos.js') }}"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const links = document.querySelectorAll("aside a[data-section]");
            const mainContent = document.getElementById("mainContent");

            links.forEach(link => {
                link.addEventListener("click", function (event) {
                    event.preventDefault(); // Evita el comportamiento predeterminado del enlace

                    const section = this.getAttribute("data-section");

                    // Indicador de carga
                    mainContent.innerHTML = `<p class="text-gray-500">Cargando...</p>`;

                    // Realiza la solicitud para cargar el contenido
                    fetch(`/partials/${section}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error al cargar la sección: ${response.statusText}`);
                            }
                            return response.text();
                        })
                        .then(html => {
                            mainContent.innerHTML = html; // Inserta el contenido en el main

                            // Ejecuta el código específico para la sección cargada
                            if (section === "dashboard") {
                                initializeDashboard(); // Inicializa el dashboard
                            }
                            
                            if (section === "clientes") {
                                initializeClientes(); // Llama a la función para inicializar la vista de clientes
                            }
                            if (section === "proveedores") {
                                initializeProveedores(); // Llama a la función para inicializar la vista de proveedores
                            }
                            if (section === "entradas_mercaderias") {
                                initializeEntradas_Mercaderias(); // Llama a la función para inicializar la vista de entradas de mercancía
                            }
                            if (section === "despachos") {
                                initializeDespachos(); // Llama a la función para inicializar la vista de despachos
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            mainContent.innerHTML = `<p class="text-red-500">Error al cargar la sección.</p>`;
                        });
                });
            });
        });

        function initializeClientes() {
            // Código específico para la vista de clientes
            loadClients();

            // Inicializar el modal de clientes (agregar)
            document.getElementById("openClientModalBtn").addEventListener("click", function() {
                openClientModal();
            });

            document.getElementById("closeClientModalBtn").addEventListener("click", function() {
                closeClientModal();
            });

            document.getElementById("addClientForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addClient();
            });

            // Inicializar el modal de edición de clientes
            document.getElementById("closeEditClientModalBtn").addEventListener("click", function() {
                closeEditClientModal();
            });

            document.getElementById("cancelEditBtn").addEventListener("click", function() {
                closeEditClientModal();
            });

            document.getElementById("editClientForm").addEventListener("submit", function (event) {
                event.preventDefault();
                updateClient();
            });

            // Inicializar el modal de agregar dirección
            document.getElementById("closeAddAddressModalBtn").addEventListener("click", function() {
                closeAddAddressModal();
            });

            document.getElementById("cancelAddAddressBtn").addEventListener("click", function() {
                closeAddAddressModal();
            });

            document.getElementById("addAddressForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addModalAddress();
            });

            // Inicializar el modal de ver direcciones
            document.getElementById("closeViewAddressModalBtn").addEventListener("click", function() {
                closeViewAddressModal();
            });

            document.getElementById("closeViewAddressBtn").addEventListener("click", function() {
                closeViewAddressModal();
            });

            // Cerrar los modales al hacer clic fuera de ellos
            document.getElementById("clientModal").addEventListener("click", function(event) {
                if (event.target === this) {
                    closeClientModal();
                }
            });

            document.getElementById("editClientModal").addEventListener("click", function(event) {
                if (event.target === this) {
                    closeEditClientModal();
                }
            });

            document.getElementById("addAddressModal").addEventListener("click", function(event) {
                if (event.target === this) {
                    closeAddAddressModal();
                }
            });

            document.getElementById("viewAddressModal").addEventListener("click", function(event) {
                if (event.target === this) {
                    closeViewAddressModal();
                }
            });

            // Cerrar modales con tecla Escape
            document.addEventListener("keydown", function(e) {
                if (e.key === "Escape") {
                    if (!document.getElementById("clientModal").classList.contains("hidden")) {
                        closeClientModal();
                    }
                    if (!document.getElementById("editClientModal").classList.contains("hidden")) {
                        closeEditClientModal();
                    }
                    if (!document.getElementById("addAddressModal").classList.contains("hidden")) {
                        closeAddAddressModal();
                    }
                    if (!document.getElementById("viewAddressModal").classList.contains("hidden")) {
                        closeViewAddressModal();
                    }
                }
            });
        }

        function initializeProveedores() {
            // Código específico para la vista de proveedores
            loadSuppliers();

            document.getElementById("addSupplierForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addSuppliers();
            });

            document.getElementById("searchInput").addEventListener("input", function () {
                filterSuppliers();
            });
        }

        function initializeEntradas_Mercaderias(){
            // Código específico para la vista de entradas de mercancía
            loadSuppliersM();
            loadClientsM();
            loadMerchandiseEntries();
            
            // Configurar el modal después de que se haya cargado el contenido
            setupEntryModal();

            // Verificar si se debe recargar la tabla
            if (localStorage.getItem('reloadMerchandiseEntries') === 'true') {
                console.log('Recargando la tabla de entradas de mercancía...');
                loadMerchandiseEntries();
                localStorage.removeItem('reloadMerchandiseEntries'); // Eliminar el indicador
            }

            document.getElementById("addMerchandiseEntryForm").addEventListener("submit", function (event) {
                event.preventDefault();
                submitEntryForm();
            });

            document.getElementById("client_id").addEventListener("change", function () {
                const clientId = this.value; // Obtiene el valor del cliente seleccionado
                if (clientId) {
                    loadClientAddresses();
                } else {
                    console.warn("No se seleccionó un cliente."); // Mensaje de advertencia en lugar de error
                }
            });
        }

        function initializeDespachos() {

            // Cargar los despachos en la tabla
            loadDispatches();

            // Manejador para el formulario de creación de despachos
            const form = document.getElementById('createDispatchForm');
            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault(); // Evita que el formulario recargue la página

                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());

                    fetch('/api/dispatches', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                        .then(async response => {
                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert('Despacho creado con éxito');
                            this.reset(); // Limpia el formulario
                            loadDispatches(); // Recarga la tabla de despachos
                        })
                        .catch(error => {
                            console.error('Error al crear el despacho:', error);
                            alert('Ocurrió un error al crear el despacho. Por favor, inténtelo de nuevo.');
                        });
                });
            }
        }
        
    </script>
@endsection