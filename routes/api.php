<?php

use App\Http\Controllers\ClientAddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClientController;
use App\Http\Controllers\MerchandiseEntryController;
use App\Http\Controllers\ProductEntryController;
use App\Http\Controllers\DispatchController;
use App\Http\Controllers\SupplierController;

Route::apiResource('clients', ClientController::class);
Route::apiResource('client-addresses', ClientAddressController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('merchandise-entries', MerchandiseEntryController::class);
Route::get('/zones', [MerchandiseEntryController::class, 'getZones']);
Route::apiResource('product-entries', ProductEntryController::class);
// Rutas para despachos
Route::get('/dispatches', [DispatchController::class, 'index']);
Route::post('/dispatches', [DispatchController::class, 'store']);
Route::get('/dispatches/{dispatch}', [DispatchController::class, 'show']);
Route::post('/dispatches/{dispatch}/assign', [DispatchController::class, 'assignMerchandiseEntry']);
Route::delete('/dispatches/{dispatch}/remove/{merchandiseEntry}', [DispatchController::class, 'removeMerchandiseEntry']);
Route::get('/dispatches/{dispatchId}/totals', [DispatchController::class, 'getDispatchTotals']);
Route::get('/dispatches/{dispatchId}/clients', [DispatchController::class, 'getDispatchClients']);