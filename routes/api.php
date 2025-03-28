<?php

use App\Http\Controllers\ClientAddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClientController;
use App\Http\Controllers\MerchandiseEntryController;
use App\Http\Controllers\ProductEntryController;
use App\Http\Controllers\TruckController;
use App\Http\Controllers\DispatchController;
use App\Http\Controllers\SupplierController;

Route::apiResource('clients', ClientController::class);
Route::apiResource('client-addresses', ClientAddressController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('merchandise-entries', MerchandiseEntryController::class);
Route::apiResource('product-entries', ProductEntryController::class);
Route::apiResource('trucks', TruckController::class);
Route::apiResource('dispatches', DispatchController::class);
Route::patch('/dispatches/remove-entry/{entryId}', [DispatchController::class, 'removeEntryFromDispatch']);