<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/partials/{section}', function ($section) {
    $validSections = ['despachos','entradas_mercaderias', 'proveedores','clientes', 'dashboard']; // Lista de secciones válidas

    if (in_array($section, $validSections)) {
        return view("partials.$section");
    }

    return response()->json(['error' => 'Sección no encontrada'], 404);
});

