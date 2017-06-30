<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Kalnoy\Nestedset\NestedSet;

class CreateListingsCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listings_categories', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->text('title');
            $table->text('description')->nullable();
            $table->string('slug');
            $table->integer('user_id')->unsigned();
            $table->boolean('active');
            $table->text('thumb')->nullable();
            $table->text('settings')->nullable();
            $table->integer('orderBy')->unsigned();
            $table->timestamps();
            NestedSet::columns($table);

            $table->index(['slug', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('listings_categories');
    }
}
