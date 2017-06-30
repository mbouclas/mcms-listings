<?php

return [
    'listings' =>  [
/*        [
            'varName' => 'video',
            'label' => 'Video embed',
            'type' => 'textarea',
            'options' => null
        ],
        [
            'varName' => 'bannerImage',
            'label' => 'Banner Image',
            'type' => 'image',
            'options' => null
        ],
        [
            'varName' => 'availableToEveryOne',
            'label' => 'Who can see this',
            'type' => 'select',
            'options' => [
                [
                    'default' => true,
                    'label' => 'Everyone',
                    'value' => ''
                ],
                [
                    'default' => false,
                    'label' => 'Only me',
                    'value' => 'me'
                ],
                [
                    'default' => false,
                    'label' => 'Only god',
                    'value' => 'god'
                ],
            ]
        ],*/
    ],
    'categories' => [
        [
            'varName' => 'orderBy',
            'label' => 'Order by',
            'type' => 'select',
            'options' => [
                [
                    'default' => true,
                    'label' => 'Title',
                    'value' => 'title'
                ],
                [
                    'default' => false,
                    'label' => 'Creation date',
                    'value' => 'created_at'
                ],
                [
                    'default' => false,
                    'label' => 'Custom',
                    'value' => 'custom'
                ],
            ]
        ],
    ]
];