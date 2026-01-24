<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rutas de vistas (Inertia)
    Route::get('/clients', [\App\Http\Controllers\ClientController::class, 'index'])->name('clients.index');
    Route::get('/suppliers', [\App\Http\Controllers\SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('/merchandise-entries', [\App\Http\Controllers\MerchandiseEntryController::class, 'index'])->name('merchandise-entries.index');
    Route::get('/dispatches', [\App\Http\Controllers\DispatchController::class, 'index'])->name('dispatches.index');
    
    // Rutas API con autenticación de sesión y CSRF
    Route::prefix('api')->group(function () {
        // Clients API
        Route::get('/clients', [\App\Http\Controllers\ClientController::class, 'apiIndex']);
        Route::post('/clients', [\App\Http\Controllers\ClientController::class, 'store'])->name('clients.store');
        Route::get('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'show'])->name('clients.show');
        Route::put('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'update'])->name('clients.update');
        Route::delete('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'destroy'])->name('clients.destroy');
        
        // Client Addresses API
        Route::get('/client-addresses', [\App\Http\Controllers\ClientAddressController::class, 'index']);
        Route::post('/client-addresses', [\App\Http\Controllers\ClientAddressController::class, 'store'])->name('client-addresses.store');
        Route::get('/client-addresses/{clientAddress}', [\App\Http\Controllers\ClientAddressController::class, 'show'])->name('client-addresses.show');
        Route::put('/client-addresses/{clientAddress}', [\App\Http\Controllers\ClientAddressController::class, 'update'])->name('client-addresses.update');
        Route::delete('/client-addresses/{clientAddress}', [\App\Http\Controllers\ClientAddressController::class, 'destroy'])->name('client-addresses.destroy');
        
        // Suppliers API
        Route::get('/suppliers', [\App\Http\Controllers\SupplierController::class, 'apiIndex']);
        Route::post('/suppliers', [\App\Http\Controllers\SupplierController::class, 'store']);
        Route::get('/suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'show']);
        Route::put('/suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'update']);
        Route::delete('/suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'destroy']);
        
        // Merchandise Entries API
        Route::get('/merchandise-entries', [\App\Http\Controllers\MerchandiseEntryController::class, 'apiIndex']);
        Route::post('/merchandise-entries', [\App\Http\Controllers\MerchandiseEntryController::class, 'store']);
        Route::get('/merchandise-entries/zones', [\App\Http\Controllers\MerchandiseEntryController::class, 'getZones']);
        Route::get('/merchandise-entries/{merchandiseEntry}', [\App\Http\Controllers\MerchandiseEntryController::class, 'show']);
        Route::put('/merchandise-entries/{merchandiseEntry}', [\App\Http\Controllers\MerchandiseEntryController::class, 'update']);
        Route::delete('/merchandise-entries/{merchandiseEntry}', [\App\Http\Controllers\MerchandiseEntryController::class, 'destroy']);
        
        // Product Entries API
        Route::get('/product-entries', [\App\Http\Controllers\ProductEntryController::class, 'index']);
        Route::post('/product-entries', [\App\Http\Controllers\ProductEntryController::class, 'store']);
        Route::get('/product-entries/{merchandiseEntryId}', [\App\Http\Controllers\ProductEntryController::class, 'show']);
        Route::put('/product-entries/{productEntry}', [\App\Http\Controllers\ProductEntryController::class, 'update']);
        Route::delete('/product-entries/{productEntry}', [\App\Http\Controllers\ProductEntryController::class, 'destroy']);
        
        // Dispatches API
        Route::get('/dispatches', [\App\Http\Controllers\DispatchController::class, 'apiIndex']);
        Route::post('/dispatches', [\App\Http\Controllers\DispatchController::class, 'store']);
        Route::get('/dispatches/{dispatch}', [\App\Http\Controllers\DispatchController::class, 'show']);
        Route::put('/dispatches/{dispatch}', [\App\Http\Controllers\DispatchController::class, 'update']);
        Route::delete('/dispatches/{dispatch}', [\App\Http\Controllers\DispatchController::class, 'destroy']);
        Route::post('/dispatches/{dispatch}/assign', [\App\Http\Controllers\DispatchController::class, 'assignMerchandiseEntry']);
        Route::delete('/dispatches/{dispatch}/remove/{merchandiseEntry}', [\App\Http\Controllers\DispatchController::class, 'removeMerchandiseEntry']);
        Route::post('/dispatches/{dispatch}/assign-bulk', [\App\Http\Controllers\DispatchController::class, 'assignBulk']);
        Route::get('/dispatches/{dispatch}/totals', [\App\Http\Controllers\DispatchController::class, 'getDispatchTotals']);
        Route::get('/dispatches/{dispatch}/clients', [\App\Http\Controllers\DispatchController::class, 'getDispatchClients']);
        Route::post('/dispatches/{dispatch}/export-pdf', [\App\Http\Controllers\DispatchController::class, 'exportPDF'])->name('dispatches.export-pdf');
    });
});

require __DIR__.'/auth.php';
