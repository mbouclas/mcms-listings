<?php

namespace Mcms\Listings\Installer\AfterUpdate\AlterTables;


use Carbon\Carbon;
use Mcms\Core\Models\User;
use Illuminate\Console\Command;
use Schema;

class AddSkuToListings
{
    public function handle(Command $command)
    {
        $migration = '2016_29_12_093345_add_sku_to_listings.php';
        $targetFile = database_path("migrations/{$migration}");
        if ( ! \File::exists($targetFile)){
            \File::copy(__DIR__ . "/../../../../database/migrations/{$migration}", $targetFile);
        }

        if (! Schema::hasColumn('listings', 'sku')){
            $command->call('migrate');
        }


    }
}