<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductEntry extends Model
{
    protected $fillable = ['merchandise_entry_id', 'product_name', 'quantity', 'type'];

    protected $hidden = ['created_at', 'updated_at'];

    public function merchandiseEntry() {
        return $this->belongsTo(MerchandiseEntry::class);
    }
}
