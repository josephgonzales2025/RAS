<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = ['ruc_dni', 'business_name'];

    protected $hidden = ['created_at', 'updated_at'];

    public function addresses() {
        return $this->hasMany(ClientAddress::class);
    }

    public function merchandiseEntries() {
        return $this->hasMany(MerchandiseEntry::class);
    }
}
