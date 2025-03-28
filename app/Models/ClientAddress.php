<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientAddress extends Model
{
    protected $fillable = ['client_id', 'address', 'zone'];

    protected $hidden = ['created_at', 'updated_at'];

    public function client() {
        return $this->belongsTo(Client::class);
    }
}
