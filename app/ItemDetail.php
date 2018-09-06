<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemDetail extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'items_detail';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    use SoftDeletes;
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    
    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * Get the user that owns the shop.
     */
    public function items()
    {
        return $this->belongsTo('App\Item');
    }

    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
