<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersDetail extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('users_id');
            $table->integer('levels_id');
            $table->integer('parents_id');
            $table->string('address');
            $table->string('provinces_id');
            $table->string('citys_id');
            $table->string('districts_id');
            $table->string('phone');
            $table->string('bbm');
            $table->string('wa');
            $table->string('wa_template');
            $table->string('line');
            $table->string('discount');
            $table->integer('is_deposit');
            $table->string('deposit');
            $table->string('balance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_detail');
    }
}
