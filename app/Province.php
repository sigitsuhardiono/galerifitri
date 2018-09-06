<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'provinces';

    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * Get the citys for the provinces.
     */
    public function citys()
    {
        return $this->hasMany('App\Citys');
    }

    /**
     * Get the shops for the user.
     */
    public function shops()
    {
        return $this->hasMany('App\Shop');
    }
    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////

}
