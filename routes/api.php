<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
| NOTA: Las rutas que usan autenticación de sesión (web) y CSRF han sido
| movidas a routes/web.php con el prefijo 'api' para evitar conflictos
| con el middleware 'api' que no incluye validación CSRF.
|
*/

// Si en el futuro necesitas rutas API reales con autenticación basada en tokens
// (Sanctum, Passport, etc.), puedes agregarlas aquí.
// Ejemplo:
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });