<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShopDetail extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'shops_detail';

    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * Get the user that owns the shop.
     */
    public function userdetail()
    {
        return $this->belongsTo('App\UserDetail', 'users_id');
    }

    /**
     * Get the user that owns the shop.
     */
    public function shops()
    {
        return $this->belongsTo('App\Shop', 'shops_id');

    }

    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
