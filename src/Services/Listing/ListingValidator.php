<?php
/**
 * Created by PhpStorm.
 * User: mbouc
 * Date: 13-Jun-16
 * Time: 12:24 PM
 */

namespace Mcms\Listings\Services\Listing;

use Mcms\Listings\Exceptions\InvalidListingFormatException;
use Validator;

class ListingValidator
{
    public function validate(array $item)
    {
        $check = Validator::make($item, [
            'title' => 'required',
            'user_id' => 'required',
            'active' => 'required',
            'categories' => 'required|array',
        ]);

        if ($check->fails()) {
            throw new InvalidListingFormatException($check->errors());
        }

        return true;
    }
}