@extends('layouts.app')

@section('title', 'Sistema RAS')

@section('content')
    <div id="mainContent">
        <h1 class="text-2xl font-bold mb-4">Bienvenido</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
    </div>
@endsection

@section('scripts')
    <!-- Incluye jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

    <!-- Incluye Select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
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
                                console.log("Inicializando clientes...");
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

            document.getElementById("addClientForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addClient();
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

            // Verificar si se debe recargar la tabla
            if (localStorage.getItem('reloadMerchandiseEntries') === 'true') {
                console.log('Recargando la tabla de entradas de mercancía...');
                loadMerchandiseEntries();
                localStorage.removeItem('reloadMerchandiseEntries'); // Eliminar el indicador
            }

            document.getElementById("addMerchandiseEntryForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addMerchandiseEntry();
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
            console.log("Inicializando la vista de despachos...");

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