<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dispatch extends Model
{
    protected $fillable = ['truck_id', 'date'];

    protected $hidden = ['created_at', 'updated_at'];

    public function truck() {
        return $this->belongsTo(Truck::class);
    }

    public function merchandiseEntries() {
        return $this->hasMany(MerchandiseEntry::class, 'dispatch_id');
    }
}
