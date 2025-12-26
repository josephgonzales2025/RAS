<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Mi Aplicación')</title>
    <script src="https://cdn.tailwindcss.com"></script> <!-- Framework CSS Tailwind -->
    <link rel="stylesheet" href="{{ asset('css/custom.css') }}"> <!-- Archivo CSS personalizado -->
    <style>
        /* Estilos para el sidebar con hover */
        #sidebar {
            transition: width 0.3s ease-in-out;
            overflow: hidden;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 40;
        }
        
        #sidebar.collapsed {
            width: 4rem; /* 64px - ancho colapsado */
        }
        
        #sidebar.collapsed .menu-text {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }
        
        #sidebar.collapsed h2 {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }
        
        .menu-text {
            transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out;
            white-space: nowrap;
        }
        
        #sidebar h2 {
            transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out;
        }
        
        /* Asegurar que los iconos siempre sean visibles */
        .menu-icon {
            min-width: 1.5rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
        
        /* Ajustar el margen del contenido principal según el estado del sidebar */
        main {
            transition: margin-left 0.3s ease-in-out;
        }
        
        @media (min-width: 768px) {
            main.sidebar-collapsed {
                margin-left: 4rem; /* Espacio para el sidebar colapsado */
            }
            
            main.sidebar-expanded {
                margin-left: 16rem; /* Espacio para el sidebar expandido */
            }
        }
        
        /* En móvil, mantener comportamiento normal */
        @media (max-width: 768px) {
            #sidebar {
                position: relative;
                z-index: 50;
            }
            
            #sidebar.collapsed {
                width: 100%;
            }
            
            #sidebar.collapsed .menu-text,
            #sidebar.collapsed h2 {
                opacity: 1;
                width: auto;
            }
            
            main {
                margin-left: 0 !important;
            }
        }
    </style>
</head>
<body class="bg-gray-100 flex flex-col md:flex-row">
    <!-- Menú lateral -->
    <button id="menuToggle" class="bg-gray-700 text-white px-4 py-2 rounded md:hidden">Menú</button>
    <aside id="sidebar" class="w-full md:w-64 bg-gray-800 text-white min-h-screen p-4 hidden md:block">
        <h2 class="text-lg font-bold mb-4">Menú</h2>
        <ul>
            <li class="mb-2">
                <a href="#" class="block p-2 hover:bg-gray-700 flex items-center" data-section="dashboard">
                    <span class="menu-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                    </span>
                    <span class="menu-text ml-3">Dashboard</span>
                </a>
            </li>
            <li class="mb-2">
                <a href="#" class="block p-2 hover:bg-gray-700 flex items-center" data-section="clientes">
                    <span class="menu-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </span>
                    <span class="menu-text ml-3">Clientes</span>
                </a>
            </li>
            <li class="mb-2">
                <a href="#" class="block p-2 hover:bg-gray-700 flex items-center" data-section="proveedores">
                    <span class="menu-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </span>
                    <span class="menu-text ml-3">Proveedores</span>
                </a>
            </li>
            <li class="mb-2">
                <a href="#" class="block p-2 hover:bg-gray-700 flex items-center" data-section="entradas_mercaderias">
                    <span class="menu-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </span>
                    <span class="menu-text ml-3">Recepción</span>
                </a>
            </li>
            <li class="mb-2">
                <a href="#" class="block p-2 hover:bg-gray-700 flex items-center" data-section="despachos">
                    <span class="menu-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                        </svg>
                    </span>
                    <span class="menu-text ml-3">Despachos</span>
                </a>
            </li>
            <li class="mt-auto border-t border-gray-700 pt-2">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="w-full text-left block p-2 hover:bg-red-700 flex items-center text-red-300 hover:text-white transition-colors duration-200">
                        <span class="menu-icon">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                        </span>
                        <span class="menu-text ml-3">Cerrar Sesión</span>
                    </button>
                </form>
            </li>
        </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8">
        @yield('content') <!-- Aquí se insertará el contenido de cada vista -->
    </main>

    @yield('scripts') <!-- Aquí se insertarán los scripts específicos -->
    <script>
        // Mostrar/ocultar el menú al presionar el botón "Menú"
        document.getElementById('menuToggle').addEventListener('click', function () {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('hidden');
        });
    
        // Ocultar el menú automáticamente al seleccionar un elemento del menú
        const menuLinks = document.querySelectorAll('#sidebar a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                const sidebar = document.getElementById('sidebar');
                if (!sidebar.classList.contains('hidden')) {
                    sidebar.classList.add('hidden'); // Oculta el menú
                }
            });
        });
        
        // Funcionalidad de hover para colapsar/expandir el sidebar (solo en desktop)
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('main');
        
        // Verificar si estamos en desktop (md breakpoint de Tailwind es 768px)
        function isDesktop() {
            return window.innerWidth >= 768;
        }
        
        // Función para actualizar el estado del sidebar y main
        function updateSidebarState(collapsed) {
            if (collapsed) {
                sidebar.classList.add('collapsed');
                if (mainContent) {
                    mainContent.classList.remove('sidebar-expanded');
                    mainContent.classList.add('sidebar-collapsed');
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (mainContent) {
                    mainContent.classList.remove('sidebar-collapsed');
                    mainContent.classList.add('sidebar-expanded');
                }
            }
        }
        
        // Colapsar sidebar cuando el mouse sale (solo en desktop)
        sidebar.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                updateSidebarState(true);
            }
        });
        
        // Expandir sidebar cuando el mouse entra (solo en desktop)
        sidebar.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                updateSidebarState(false);
            }
        });
        
        // Inicializar el sidebar colapsado en desktop
        if (isDesktop()) {
            updateSidebarState(true);
        }
        
        // Manejar cambios de tamaño de ventana
        window.addEventListener('resize', function() {
            if (!isDesktop()) {
                // En móvil, remover las clases
                sidebar.classList.remove('collapsed');
                if (mainContent) {
                    mainContent.classList.remove('sidebar-collapsed', 'sidebar-expanded');
                }
            } else {
                // En desktop, inicializar colapsado
                updateSidebarState(true);
            }
        });
    </script>
    <script src="{{ asset('js/libs.js') }}"></script>
</body>
</html>