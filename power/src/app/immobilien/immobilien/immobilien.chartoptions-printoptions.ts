/**
 * Chart Options (Merge) for hideing view components and show print components
 */
export const mergeHide = {
    title: {
        show: true,
    },
    toolbox: {
        show: false
    },
    dataZoom: [
        {
            type: 'slider',
            show: false
        }
    ],
    grid: [
        {
            id: 'main',
            right: 600
        }
    ],
    graphic: [
        {
            id: 'copyright',
            right: 600
        },
        {
            id: 'legend',
            ignore: false
        }
    ],
    xAxis: [
        {
            id: 'xds',
            show: false
        }

    ],
    yAxis: [
        {
            id: 'yds',
            show: false
        }
    ],
    series: [
        {
            id: 'a',
            areaStyle: {
                color: '#fff'
            },
            itemStyle: {
                color: '#fff'
            }
        }
    ]
};

/**
 * Chart Options (Merge) for show view components and hide print components
 */
export const mergeShow = {
    title: {
        show: false
    },
    toolbox: {
        show: true
    },
    dataZoom: [
        {
            type: 'slider',
            show: true
        }
    ],
    grid: [
        {
            id: 'main',
            right: 90
        }
    ],
    graphic: [
        {
            id: 'copyright',
            right: 90
        },
        {
            id: 'legend',
            ignore: true
        }
    ],
    xAxis: [
        {
            id: 'xds',
            show: true
        }

    ],
    yAxis: [
        {
            id: 'yds',
            show: true
        }
    ],
    series: [
        {
            id: 'a',
            areaStyle: {
                color: '#ccc'
            },
            itemStyle: {
                color: '#ccc'
            }
        }
    ]
};

/* vim: set expandtab ts=4 sw=4 sts=4: */
