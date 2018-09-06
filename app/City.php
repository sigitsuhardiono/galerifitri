<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'citys';


    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * Get the province that owns the city.
     */
    public function province()
    {
        return $this->belongsTo('App\Province');
    }

    /**
     * Get the districts for the citys.
     */
    public function districs()
    {
        return $this->hasMany('App\Distirct');
    }

    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
