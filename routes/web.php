<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Rutas de Autenticación
Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');

// Rutas Protegidas
Route::middleware(['auth'])->group(function () {
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
});

