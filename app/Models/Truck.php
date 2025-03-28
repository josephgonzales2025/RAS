<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Truck extends Model
{
    protected $fillable = ['plate_number', 'model', 'driver_name'];

    protected $hidden = ['created_at', 'updated_at'];

    public function dispatches() {
        return $this->hasMany(Dispatch::class);
    }
}
