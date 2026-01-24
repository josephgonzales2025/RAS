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

    // Override toArray para usar camelCase en lugar de snake_case
    public function toArray()
    {
        $array = parent::toArray();
        
        // Si la relación está cargada, renombrar la clave a camelCase
        if (isset($array['merchandise_entries'])) {
            $array['merchandiseEntries'] = $array['merchandise_entries'];
            unset($array['merchandise_entries']);
        }
        
        return $array;
    }
}
