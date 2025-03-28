<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchandiseEntry extends Model
{
    protected $fillable = [
        'reception_date',
        'guide_number',
        'supplier_id',
        'client_id',
        'client_address_id',
        'total_weight',
        'total_freight',
        'dispatch_id',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($entry) {
            $entry->status = 'Pending'; // Siempre inicia como "Pending"
            if (!isset($entry->dispatch_id)) {
                $entry->dispatch_id = null; // Si no se asigna, queda NULL
            }
        });

        static::saving(function ($entry) {
            $entry->status = $entry->dispatch_id ? 'Dispatched' : 'Pending';
        });
    }


    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public function clientAddress() {
        return $this->belongsTo(ClientAddress::class);
    }

    public function products() {
        return $this->hasMany(ProductEntry::class);
    }

    public function truck() {
        return $this->belongsTo(Truck::class);
    }

    public function dispatch() {
        return $this->belongsTo(Dispatch::class);
    }
    
}
