<?php

namespace Mcms\Listings\Console\Commands\InstallerActions;


use Illuminate\Console\Command;

class SeedDataBase
{
    public function handle(Command $command)
    {
        $command->call('core:translations:import');
        $command->comment('* Database seeded');
    }
}