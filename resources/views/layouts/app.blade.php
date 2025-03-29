<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mi Aplicación')</title>
    <script src="https://cdn.tailwindcss.com"></script> <!-- Framework CSS Tailwind -->
    <link rel="stylesheet" href="{{ asset('css/custom.css') }}"> <!-- Archivo CSS personalizado -->
</head>
<body class="bg-gray-100 flex">
    <!-- Menú lateral -->
    <aside class="w-64 bg-gray-800 text-white min-h-screen p-4">
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
    <main class="flex-1 p-6">
        @yield('content') <!-- Aquí se insertará el contenido de cada vista -->
    </main>

    @yield('scripts') <!-- Aquí se insertarán los scripts específicos -->
</body>
</html>