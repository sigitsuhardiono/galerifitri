<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deposit';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at'
    ];

    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////
    
    /**
     * Get the user that owns the shop.
     */
    public function users()
    {
        return $this->belongsTo('App\User', 'users_id');
    }
    

    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
