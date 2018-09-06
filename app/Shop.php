<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'shops';

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
     * Get the detail that owns the shop.
     */
    public function shopdetails()
    {
        return $this->hasMany('App\ShopDetail', "shops_id");
    }

    /**
     * Get the user that owns the shop.
     */
    public function users()
    {
        return $this->belongsTo('App\User', 'users_id');
    }

    /**
     * Get the user that owns the shop.
     */
    public function customers()
    {
        return $this->belongsTo('App\Customer', 'customers_id');
    }


    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
