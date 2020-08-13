import * as echarts from 'echarts';
import * as ImmobilenHelper from './immobilien.helper';

/**
 * Return Date Array for given Periods
 *
 * @param lastYear Year of the last available NIPIX Data
 * @param lastPeriod Period of the last available NIPIX Data
 *
 * @return DateArray array
 */
export function getDateArray(lastYear: number, lastPeriod: number) {

    const date = [];

    // Generate the date array
    const now = new Date();

    for (let i = 2000; i < lastYear + 1; i++) {
        for (let q = 1; q < 5; q++) {
            if ((!(i <= 2000 && q === 1)) && (!((i === lastYear) && (q > lastPeriod)))) {
                date.push(i + '/' + q);
            }
        }

    }

    return date;
}

/**
 * Convert myRegion list to MapRegionen array.
 *
 * @param regionen Regionen Object
 * @param myregion FindMyRegion Region
 * @param selectionList List of selected Regions
 * @param lighten (default false) Lighten the areaColor
 *
 * @return MapRegionen array
 */
export function getMyMapRegionen(regionen, myregion = null, selectionList = null, lighten = false) {
    const res = [];
    const keys = Object.keys(regionen);
    for (let i = 0; i < keys.length; i++) {
        let bw = 1;
        let bc = '#333333';

        if (myregion !== undefined && myregion !== null && myregion === keys[i]) {
            bw = 4;
            bc = '#ffffff';
        }

        const region = {
            'name': keys[i],
            'itemStyle': {
                'areaColor': '#dddddd',
                'borderColor': bc,
                'borderWidth': bw
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': ImmobilenHelper.convertColor(regionen[keys[i]].color),
                    'borderColor': bc,
                    'borderWidth': bw
                }
            }
        };

        if (lighten === true) {
            region['itemStyle']['areaColor'] = ImmobilenHelper.modifyColor(regionen[keys[i]].color, 0.85);
        }

        if (selectionList !== null && selectionList !== undefined && Array.isArray(selectionList)) {
            if (selectionList.includes(keys[i])) {
                region['selected'] = true;
            }
        }

        res.push(region);
    }

    return res;
}


/**
 * Generate a Series object
 *
 * @param name Series Name
 * @param data Series data array
 * @param color Series color (Must be valid for convertColor)
 * @param labelFormatter Custom labelFormatter function
 * @param selectedChartLine Name of the selected chart line (for highlghting)
 * @param zIndex xAxisIndex (degfault 0) (see echarts api)
 * @param yIndex yAxisIndex (Default 0) (see echarts api)
 * @param seriesType SeriesTyp (default line) (see echarts api)
 *
 * @return echarts Series Object
 */
export function generateSeries(name, data, color, labelFormatter = null, selectedChartLine = '',
                               xIndex = 0, yIndex = 0, seriesType = 'line'): echarts.EChartOption.SeriesLine {

    let seriesColor = ImmobilenHelper.convertColor(color);
    let zindex = 0;

    if ((selectedChartLine !== '') && (selectedChartLine !== name)) {
        seriesColor = ImmobilenHelper.modifyColor(color, 0.9);
    } else {
        zindex = 1;
    }

    // Series Object
    const ret = {
        'name': name,
        'type': seriesType,
        'smooth': false,
        'symbol': 'circle',
        'symbolSize': 4,
        'sampling': 'average',
        'zlevel': zindex,
        'itemStyle': {
            'color': seriesColor,
            'borderWidth': 16,
            'borderColor': 'rgba(255,255,255,0)'
        },
        'emphasis': {
            'itemStyle': {
                'color': seriesColor
            }
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: labelFormatter
            },
        },
        'data': data
    };


    // Set the corresponding Grid/Axis id
    if (xIndex !== 0) {
        ret['xAxisIndex'] = xIndex;
    }

    if (yIndex !== 0) {
        ret['yAxisIndex'] = yIndex;
    }

    return ret;
}


/**
 * Generate Series data
 *
 * @param data raw Series Data
 * @param date date arry for data
 * @param field Data array field
 * @offset Offset for ercentage calculation
 *
 * @return Data array
 */
export function generateDrawSeriesData(data, date = [], field = null, offset = 100) {

    // Empty data array
    const ret = [];

    // Iterate over all available data
    for (let d = 0; d < date.length; d++) {
        if (data.hasOwnProperty(date[d].replace('/', '_')) || field === null) {

            let val = '';
            let fval = 0;

            if (field === null) {
                val = data[d];
            } else {
                val = data[date[d].replace('/', '_')][field];
            }

            if (typeof val === 'string') {
                fval = parseFloat(val.replace(',', '.'));
            } else {
                fval = val;
            }

            fval = parseFloat((fval + (100 - offset)).toFixed(2));

            ret.push(fval);
        } else {
            ret.push(undefined);
        }
    }
    return ret;
}


export function generateTextElement(name, color = '#000', fontSizeBase = 1.2, position = 0, posX?) {
    return {
        type: 'text',
        top: position * 1.5 * ImmobilenHelper.convertRemToPixels(fontSizeBase),
        left: posX,
        style: {
            fill: ImmobilenHelper.convertColor(color),
            textAlign: 'left',
            fontSize: ImmobilenHelper.convertRemToPixels(fontSizeBase),
            text: name
        }
    };
}

export function generateDotElement(radius = 4, color = '#fff', fontSizeBase = 1.2, position = 0,
                                   posX = 0, bordercolor = '#000', border = 0) {
    return {
        type: 'circle',
        cursor: 'normal',
        shape: {
            cx: -2 * radius + posX * radius * 4,
            cy: position * 1.5 * ImmobilenHelper.convertRemToPixels(fontSizeBase)
                + ImmobilenHelper.convertRemToPixels(fontSizeBase) / 2,
            r: radius
        },
        style: {
            fill: ImmobilenHelper.convertColor(color),
            stroke: ImmobilenHelper.convertColor(bordercolor),
            lineWidth: border
        }
    };

}

export function modifyRegionen(regionen, modifyArray) {

    const newRegionen = JSON.parse(JSON.stringify(regionen));

    for (let i = 0; i < modifyArray.length; i++) {
        for (let v = 0; v < modifyArray[i]['values'].length; v++) {
            newRegionen[modifyArray[i]['values'][v]]['color'] = modifyArray[i]['colors'];
        }
    }

    return newRegionen;
}
/* vim: set expandtab ts=4 sw=4 sts=4: */