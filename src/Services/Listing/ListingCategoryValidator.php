<?php
/**
 * Created by PhpStorm.
 * User: mbouc
 * Date: 13-Jun-16
 * Time: 12:24 PM
 */

namespace Mcms\Listings\Services\Listing;

use Mcms\Listings\Exceptions\InvalidListingCategoryFormatException;
use Validator;

class ListingCategoryValidator
{
    public function validate(array $item)
    {
        $check = Validator::make($item, [
            'title' => 'required',
            'user_id' => 'required',
            'active' => 'required',
        ]);

        if ($check->fails()) {
            throw new InvalidListingCategoryFormatException($check->errors());
        }

        return true;
    }
}