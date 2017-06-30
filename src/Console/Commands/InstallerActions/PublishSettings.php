<?php

namespace Mcms\Listings\Console\Commands\InstallerActions;


use Illuminate\Console\Command;


/**
 * @example php artisan vendor:publish --provider="Mcms\Listings\ListingsServiceProvider" --tag=config
 * Class PublishSettings
 * @package Mcms\Listings\Console\Commands\InstallerActions
 */
class PublishSettings
{
    /**
     * @param Command $command
     */
    public function handle(Command $command)
    {
        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Listings\ListingsServiceProvider',
            '--tag' => ['config'],
        ]);

        $command->comment('* Settings published');
    }
}