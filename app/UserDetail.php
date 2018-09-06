<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users_detail';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'users_id',
        'address',
        'phone',
        'discount'
    ];

    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class,'users_id');
    }
    
    public function parent()
    {
        return $this->belongsTo(User::class,'parents_id');
    }

    public function level(){
        return $this->belongsTo('App\Level', 'levels_id');
    }

    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////

}
