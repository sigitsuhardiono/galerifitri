<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code');
            $table->integer('users_id');
            $table->integer('customers_id');
            $table->string('sender_name');
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->string('receiver_address');
            $table->string('receiver_province');
            $table->string('receiver_city');
            $table->string('receiver_district');
            $table->string('note');
            $table->string('send_courier');
            $table->string('send_service');
            $table->integer('send_price');
            $table->integer('users_komisi');
            $table->integer('komisi');
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
        Schema::dropIfExists('shops');
    }
}
