<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShopsDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shops_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('shops_id');
            $table->integer('items_id');
            $table->integer('items_name');
            $table->integer('items_price');
            $table->integer('items_price_discount');
            $table->integer('discount');
            $table->integer('discount_rupiah');
            $table->integer('qty');
            $table->integer('weight');
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
        Schema::dropIfExists('shops_detail');
    }
}
