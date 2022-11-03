'use strict';

const LAYERS = 'mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7';
const ACCESS_TOKEN = 'pk.eyJ1IjoibWtlbGxlcjMiLCJhIjoieFdYUUg5TSJ9.qzhP1v5f1elHrnTV4YpkiA';
const STYLE_URL = `https://a.tiles.mapbox.com/v4/${LAYERS}/{z}/{x}/{y}.vector.pbf?access_token=${ACCESS_TOKEN}`;

// module.exports = {
//     SERVER_PORT: 3000,
//     STYLE: {
//         'version': 8,
//         'name': 'Empty',
//         'sources': {
//             'mapbox': {
//                 'type': 'vector',
//                 'maxzoom': 15,
//                 'tiles': [
//                     STYLE_URL
//                 ]
//             }
//         },
//         'layers': [
//             {
//                 'id': 'background',
//                 'type': 'background',
//                 'paint': {
//                     'background-color': 'white'
//                 }
//             },
//             {
//                 'id': 'water',
//                 'type': 'fill',
//                 'source': 'mapbox',
//                 'source-layer': 'water',
//                 'paint': {
//                     'fill-color': 'blue'
//                 }
//             }
//         ]
//     }
// };

module.exports = {
    SERVER_PORT: 3000,
    STYLE: {
        'version': 8,
        'sources': {
            'counties': {
                'type': 'vector',
                'tiles': [
                    'http://127.0.0.1:8000/api/v1/collections/user_data.cngglklbpqrkiturhcabzlpauekzkvavwkkzfrghnanrwqaczh/tiles/WorldCRS84Quad/{z}/{x}/{y}'
                ]
            }
        },
        'layers': [
            {
                'id': 'background',
                'type': 'background',
                'paint': {
                    'background-color': 'white'
                }
            },
            {
                'id': 'counties',
                'type': 'fill',
                'source': 'counties',
                'source-layer': 'user_data.cngglklbpqrkiturhcabzlpauekzkvavwkkzfrghnanrwqaczh',
                'paint': {
                    'fill-color': 'red',
                    'fill-opacity': 0.5
                }
            },
            {
                'id': 'counties',
                'type': 'line',
                'source': 'counties',
                'source-layer': 'user_data.cngglklbpqrkiturhcabzlpauekzkvavwkkzfrghnanrwqaczh',
                'paint': {
                    'line-color': 'black'
                }
            }
        ]
    }
};