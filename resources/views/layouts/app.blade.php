<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mi Aplicación')</title>
    <script src="https://cdn.tailwindcss.com"></script> <!-- Framework CSS Tailwind -->
    <link rel="stylesheet" href="{{ asset('css/custom.css') }}"> <!-- Archivo CSS personalizado -->
</head>
<body class="bg-gray-100 flex flex-col md:flex-row">
    <!-- Menú lateral -->
    <button id="menuToggle" class="bg-gray-700 text-white px-4 py-2 rounded md:hidden">Menú</button>
    <aside id="sidebar" class="w-full md:w-64 bg-gray-800 text-white min-h-screen p-4 hidden md:block">
        <h2 class="text-lg font-bold mb-4">Menú</h2>
        <ul>
            <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-700" data-section="dashboard">Dashboard</a></li>
            <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-700" data-section="clientes">Clientes</a></li>
            <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-700" data-section="proveedores">Proveedores</a></li>
            <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-700" data-section="entradas_mercaderias">Recepción</a></li>
            <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-700" data-section="despachos">Despachos</a></li>
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
    </script>
</body>
</html>