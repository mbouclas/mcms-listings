<?php

namespace Mcms\Listings\Installer\AfterUpdate;

use Mcms\Core\Models\UpdatesLog;
use Illuminate\Console\Command;
use Mcms\Listings\Installer\AfterUpdate\AlterTables\AddSkuToListings;

class AlterTables
{
    public function handle(Command $command, UpdatesLog $item)
    {
        $classes = [
            AddSkuToListings::class
        ];

        foreach ($classes as $class) {
            (new $class())->handle($command);
        }


        $item->result = true;
        $item->save();
        $command->comment('All done in AlterTables');
    }
}