<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';
    use SoftDeletes;
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    ////////////////////////////////////////////////////////////////////
    /////////////////////// Relationship Area //////////////////////////
    ////////////////////////////////////////////////////////////////////

    public function detail(){
        return $this->hasOne(UserDetail::class,'users_id');
    }
    
    public function level(){
        return $this->hasOne(Level::class,'id');
    }

    /**
     * Get the shops for the user.
     */
    public function shops()
    {
        return $this->hasMany('App\Shop','users_id');
    }
    
    /**
     * Get the shops for the user.
     */
    public function childs()
    {
        return $this->hasMany('App\UserDetail');
    }

    /**
     * Get the shops for the customer.
     */
    public function customer()
    {
        return $this->hasMany('App\Customer');
    }
    ////////////////////////////////////////////////////////////////////
    /////////////////// End of Relationship Area ///////////////////////
    ////////////////////////////////////////////////////////////////////
}
