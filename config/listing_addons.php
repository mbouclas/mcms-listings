<?php
return [
    'route' => null,
    'slug_pattern' => '/listing-addon/%slug$s',
    'images' => [
        'keepOriginals' => true,
        'optimize' => true,
        'dirPattern' => 'listings/listing_%id$s',
        'filePattern' => '',
        'recommendedSize' => '700x700',
        'types' => [
            [
                'uploadAs' => 'image',
                'name' => 'images',
                'title' => 'Images',
                'settings' => [
                    'default' => true
                ]
            ],
            [
                'name' => 'floor_plans',
                'title' => 'Floor Plans',
                'uploadAs' => 'image',
                'settings' => [
                    'default' => false
                ]
            ]
        ],
        'copies' => [
            'thumb' => [
                'width' => 70,
                'height' => 70,
                'quality' => 100,
                'prefix' => 't_',
                'resizeType' => 'fit',
                'dir' => 'thumbs/',
            ],
            'big_thumb' => [
                'width' => 170,
                'height' => 170,
                'quality' => 100,
                'prefix' => 't1_',
                'resizeType' => 'fit',
                'useOnAdmin' => true,
                'dir' => 'big_thumbs/',
            ],
            'main' => [
                'width' => 500,
                'height' => 500,
                'quality' => 100,
                'prefix' => 'm_',
                'resizeType' => 'fit',
                'dir' => '/',
            ],
        ]
    ],
];