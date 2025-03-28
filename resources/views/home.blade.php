@extends('layouts.app')

@section('title', 'Gestión de Clientes')

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
    </script>
@endsection