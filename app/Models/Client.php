<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = ['ruc_dni', 'business_name', 'email', 'phone'];

    protected $appends = ['ruc'];

    protected $hidden = ['created_at', 'updated_at'];

    public function addresses() {
        return $this->hasMany(ClientAddress::class);
    }

    public function merchandiseEntries() {
        return $this->hasMany(MerchandiseEntry::class);
    }

    public function setBusinessNameAttribute($value)
    {
        $this->attributes['business_name'] = strtoupper($value);
    }

    // Accessor para ruc (lee de ruc_dni)
    public function getRucAttribute()
    {
        return $this->attributes['ruc_dni'];
    }

    // Mutator para ruc (escribe en ruc_dni)
    public function setRucAttribute($value)
    {
        $this->attributes['ruc_dni'] = $value;
    }
}
