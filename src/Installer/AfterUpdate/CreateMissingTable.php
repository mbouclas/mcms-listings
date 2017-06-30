<?php

namespace Mcms\Listings\Installer\AfterUpdate;


use Mcms\Core\Models\UpdatesLog;
use Illuminate\Console\Command;

class CreateMissingTable
{
    public function handle(Command $command, UpdatesLog $item)
    {
        $item->result = true;
        $item->save();
        $command->comment('All done in CreateMissingTable');
    }
}