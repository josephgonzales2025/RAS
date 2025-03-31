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
        'status',
        'dispatch_id'
    ];

    protected $hidden = ['created_at', 'updated_at'];


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

    // Relación con Dispatch
    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class);
    }

    public function setGuideNumberAttribute($value)
    {
        $this->attributes['guide_number'] = strtoupper($value);
    }
    
}
