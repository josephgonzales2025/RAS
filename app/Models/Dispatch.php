<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'dispatch_date',
        'driver_name',
        'driver_license',
        'transport_company_name',
        'transport_company_ruc',
    ];

    // Relación con merchandise_entries
    public function merchandiseEntries()
    {
        return $this->hasMany(MerchandiseEntry::class);
    }
}
