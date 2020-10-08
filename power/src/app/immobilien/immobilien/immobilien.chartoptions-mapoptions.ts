function getScatter(position) {
    return  {
        'type': 'effectScatter',
        'coordinateSystem': 'geo',
        'zlevel': 2,

        'label': {
            'fontSize': null,
            'normal': {
                'show': true,
                'position': position,
                'offset': [0, 0],
                'formatter': '{b}',
                'backgroundColor': 'rgba(255,255,255,0.7)'
            },
            'emphasis': {
                'show': true
            }
        },
        'symbol': 'circle',
        'symbolSize': 4,
        'itemStyle': {
            'normal': {
                'show': true,
            }
        },
        'data': null
    };
}

export const mapOptions = {
    'title': {
        'text': $localize`Wohnungsmarktregionen in Niedersachsen`,
        'left': 'center',
        'top': 10,
        'textStyle': {
            fontSize: null
        }
    },
    graphic: [
        {
            type: 'text',
            id: 'copyright',
            left: 90,
            bottom: null,
            z: 100,
            style: {
                fill: '#333',
                textAlign: 'left',
                fontSize: null,
                text: null
            }
        }
    ],

    'tooltip': {
        'trigger': 'item',
        'showDelay': 0,
        'transitionDuration': 0.2,
        'formatter': null,
        'textStyle': {
            'fontSize': null
        }
    },
    'toolbox': {
        'show': true,
        'orient': 'vertical',
        'itemSize': 30,
        'itemGap': 20,
        'right': 5,
        'top': 110,
        'feature': {
            'saveAsImage': {
                'show': true,
                'title': $localize`Bild`,
                'icon': 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'
            },
            'mySaveAsGeoJSON': {
                'show': true,
                'title': $localize`GeoJSON`,
                'icon': 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z',
                'onclick': null
            }
        }
    },
    'geo': {
        'map': 'NDS',
        'roam': false,
        'aspectScale': 1,
        'show': false
    },
    'series': [
        {
            'name': $localize`Wohnungsmarktregionen in Niedersachsen`,
            'type': 'map',
            'aspectScale': 1,
            'roam': false,
            'mapType': 'NDS', // map type should be registered
            'itemStyle': {
                'normal': {
                    'label': {
                        'show': false
                    }
                },
                'emphasis': {
                    'label': {
                        'show': false
                    }
                }
            },
            'selectedMode': null,
            'data': null,
        },
        getScatter('right'),
        getScatter('bottom'),
        getScatter('left'),
        getScatter('top')
    ],
    'color': ['#000000']
};

/* vim: set expandtab ts=4 sw=4 sts=4: */
