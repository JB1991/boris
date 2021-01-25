export const chartRange = {
    id: 'a',
    type: 'line',
    z: -1,
    xAxisIndex: 1,
    yAxisIndex: 1,
    silent: true,
    animation: false,
    areaStyle: {
        color: '#ccc'
    },
    itemStyle: {
        color: '#ccc'
    },
    smooth: false,
    symbol: 'none',
    data: [[0, 0], [0, -0.2], [50, -1], [100, -1], [100, -0.2], [100, 0]]
};

export const chartOptions = {
    'textStyle': {
        'fontSize': null
    },
    'title': {
        'text': $localize`Niedersächsischer Immobilienpreisindex (NIPIX)`,
        'left': 'center',
        'top': 10,
        'show': false,
        'textStyle': {
            fontSize: null
        }
    },
    grid: [
        {
            id: 'main',
            top: null,
            left: '60',
            right: '90',
            bottom: 75 + 15,
            'backgroundColor': 'rgb(255, 255, 255)',
            'borderColor': 'transparent',
            'show': true
        },
        {
            id: 'bottom',
            left: '60',
            right: '90',
            height: 30 + 15,
            bottom: '50'
        }
    ],
    graphic: [
        {
            type: 'text',
            id: 'copyright',
            right: 90,
            bottom: 2,
            z: 100,
            style: {
                fill: '#333',
                textAlign: 'right',
                fontSize: null,
                text: null
            }
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: null,
            axisLine: { onZero: false },
            splitLine: { show: false },
            axisLabel: {
                show: true,
                fontSize: null,
                showMinLabel: true,
                showMaxLabel: true
            },
            name: $localize`Quartal`
        },
        {
            id: 'xds',
            type: 'value',
            gridIndex: 1,
            boundaryGap: false,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 0,
            max: 100,
            silent: true
        }

    ],
    yAxis: [
        {
            type: 'value',
            boundaryGap: ['10%', '20%'],
            scale: true,
            axisLabel: {
                show: true,
                fontSize: null
            },
            name: $localize`Preisentwicklung`,
            nameLocation: 'middle',
            nameRotate: 90,
            nameGap: 35
        },
        {
            id: 'yds',
            scale: false,
            gridIndex: 1,
            splitNumber: 2,
            type: 'value',
            min: -1,
            max: 0,
            silent: true,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        }
    ],
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: [0],
            realtime: false,
            start: 80,
            end: 100,
            bottom: 30,
            height: 20,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '120%'
        }, {
            type: 'inside',
            xAxisIndex: [0],
            start: 80,
            end: 100,
            top: 30,
            height: 20
        }
    ],
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
            color: '#000'
        },
        formatter: null
    },
    toolbox: {
        show: false,
        orient: 'vertical',
        itemSize: 30,
        itemGap: 20,
        right: 5,
        top: 190,
        feature: {
            mySaveAsImage: {
                show: true,
                title: $localize`Bild`,
                icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z',
                onclick: null
            },
            mySaveAsCSV: {
                show: true,
                title: $localize`CSV`,
                icon: 'path://M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M10,19H7V17H10V19M10,16H7V14H10V16M10,13H7V11H10V13M14,19H11V17H14V19M14,16H11V14H14V16M14,13H11V11H14V13M13,9V3.5L18.5,9H13Z',
                onclick: null
            },
            mySaveAsGeoJSON: {
                show: true,
                title: $localize`GeoJSON`,
                icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z',
                onclick: null
            }

        }
    },
    series: [
        null
    ],
};

export const chartOptionsMerge = {
    'graphic': [
        null,
        {
            type: 'group',
            id: 'legend',
            left: null,
            ignore: true,
            top: 65,
            z: 100,
            children: null
        },
        {
            type: 'text',
            id: 'zeitraum',
            left: 'center',
            top: 65,
            z: 101,
            style: {
                fill: '#333',
                textAlign: 'center',
                fontSize: null,
                text: null
            }
        }
    ],
    'legend': {
        'show': true,
        'type': 'scroll',
        'top': 60,
        'z': -1,
        'data': null,
        'formatter': null
    },
    'title': {
        'text': $localize`Niedersächsischer Immobilienpreisindex (NIPIX)`,
        'subtext': null,
        'left': 'center',
        'top': 10,
        'show': false
    },
    series: null,
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: [0],
            realtime: false,
            start: null,
            end: null,
            bottom: 30,
            height: 20,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '120%'
        }
    ]

};

/* vim: set expandtab ts=4 sw=4 sts=4: */
