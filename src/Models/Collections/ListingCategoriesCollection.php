<?php

namespace Mcms\Listings\Models\Collections;

use DB;
use Kalnoy\Nestedset\Collection;

/**
 * You can extend this collection using macros
 *
 * Class ListingsCollection
 * @package Mcms\Listings\Models\Collections
 */
class ListingCategoriesCollection extends Collection
{
    public function countItems()
    {
        if ($this->count() == 0) {
            return $this;
        }

        $items = new Collection();

        foreach ($this->items as $item) {
            $items->push([
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'url' => $item->getSlug(),
                'children' => $item->descendants->pluck('id')
            ]);
        }

        $ids = [];
        $sql = [];

        foreach ($items as $item) {
            $ids[] = $item['id'];
            $qm = ['?'];

            if ($item['children']->count() > 0){
                foreach ($item['children'] as $child) {
                    $qm[] = '?';
                    $ids[] = $child;
                }
            }

            $sql[] = "(SELECT count(*) as total from listing_listing_category
             INNER JOIN listings ON (listings.id=listing_listing_category.listing_id)
             where active = 1 AND listing_category_id IN (".
                implode(',',$qm)
                .")) as c{$item['id']}";
        }

        $sql = implode(',', $sql);

        $res = DB::select("SELECT {$sql}",  $ids);
        $ret = new Collection();

        foreach ($res[0] as $index => $count){
            $id = trim($index, 'c');
            $collection = new Collection();
            $thisCat = $items->where('id', (int) $id)->first();
            foreach ($thisCat as $key => $value) {
                $collection->{$key} = $value;
            }
            $collection->count = $count;
            $ret[$id] = $collection;
        }


        return $ret;
    }
}