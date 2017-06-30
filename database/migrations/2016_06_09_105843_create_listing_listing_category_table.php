<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListingListingCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listing_listing_category', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->integer('listing_id')->unsigned()->index();
            $table->foreign('listing_id')->references('id')->on('listings')->onDelete('cascade');
            $table->integer('listing_category_id')->unsigned()->index();
            $table->foreign('listing_category_id')->references('id')->on('listings_categories')->onDelete('cascade');
            $table->boolean('main')->index()->default(false);
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
        Schema::drop('listing_listing_category');
    }
}
