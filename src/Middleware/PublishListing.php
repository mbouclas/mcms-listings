<?php

namespace Mcms\Listings\Middleware;

use Carbon\Carbon;
use Closure;
use Mcms\Listings\Models\Listing;

/**
 * Look for all listings about to be published and activate them
 *
 * Class PublishListing
 * @package Mcms\Listings\Middleware
 */
class PublishListing
{
    /**
     * @param $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        Listing::where('published_at', '>=', Carbon::now())->update(['active'=> true]);

        return $next($request);
    }
}