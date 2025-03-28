<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\ClientAddress;
use App\Models\Dispatch;
use App\Models\MerchandiseEntry;
use App\Models\ProductEntry;
use App\Models\Supplier;
use App\Models\Truck;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Poblar la tabla trucks
        Truck::insert([
            ['plate_number' => 'XYZ-123', 'model' => 'Volvo FH16', 'driver_name' => 'John Doe'],
            ['plate_number' => 'ABC-456', 'model' => 'Mercedes Actros', 'driver_name' => 'Jane Smith'],
        ]);

        // Poblar la tabla suppliers
        Supplier::insert([
            ['ruc_dni' => '20123456789', 'business_name' => 'Proveedor A'],
            ['ruc_dni' => '20456789012', 'business_name' => 'Proveedor B'],
        ]);

        // Poblar la tabla clients
        Client::insert([
            ['ruc_dni' => '10234567890', 'business_name' => 'Cliente 1'],
            ['ruc_dni' => '10987654321', 'business_name' => 'Cliente 2'],
        ]); 

        // Poblar la tabla client_addresses
        ClientAddress::insert([
            ['client_id' => 1, 'address' => 'Jr. Monte 345', 'zone' => 'Tarapoto'],
            ['client_id' => 1, 'address' => 'Jr. Lote 240', 'zone' => 'Moyobamba'],
            ['client_id' => 2, 'address' => 'Av. Central 500', 'zone' => 'Nueva Cajamarca'],
        ]);

        // Seed Dispatches
        Dispatch::insert([
            ['truck_id' => 1, 'date' => '2025-03-11'],
            ['truck_id' => 2, 'date' => '2025-03-12'],
        ]);

        // Seed Merchandise Entries
        MerchandiseEntry::insert([
            ['reception_date' => '2025-03-11', 'guide_number' => 'G-001', 'supplier_id' => 1, 'client_id' => 1,'client_address_id' => 1, 'total_weight' => 500, 'total_freight' => 150.00, 'status' => 'Pending', 'dispatch_id' => null],
            ['reception_date' => '2025-03-12', 'guide_number' => 'G-002', 'supplier_id' => 2, 'client_id' => 2, 'client_address_id' => 2,  'total_weight' => 700, 'total_freight' => 200.00, 'status' => 'Dispatched', 'dispatch_id' => 1],
        ]);

        // Seed Product Entries
        ProductEntry::insert([
            ['merchandise_entry_id' => 1, 'product_name' => 'Product A', 'quantity' => 10, 'type' => 'Electronics'],
            ['merchandise_entry_id' => 1, 'product_name' => 'Product B', 'quantity' => 15, 'type' => 'Apparel'],
            ['merchandise_entry_id' => 2, 'product_name' => 'Product C', 'quantity' => 20, 'type' => 'Furniture']
        ]);

        
        

    }
}
