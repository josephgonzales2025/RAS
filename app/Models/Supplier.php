<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = ['ruc_dni', 'business_name'];

    protected $hidden = ['created_at', 'updated_at'];

    public function merchandiseEntries() {
        return $this->hasMany(MerchandiseEntry::class);
    }
}
