/* eslint-disable max-lines */
import { ImmobilienHelper } from './immobilien.helper';

export class ImmobilienUtils {
    /**
     * Return Date Array for given Periods
     *
     * @param lastYear Year of the last available NIPIX Data
     * @param lastPeriod Period of the last available NIPIX Data
     * @returns DateArray array
     */
    static getDateArray(lastYear: number, lastPeriod: number) {

        const date = new Array<any>();

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
     * @param name
     * @param bc
     * @param bw
     * @param area
     */
    static getMyMapRegionenGR(name: string, bc: string, bw: number, area: string) {
        return {
            'name': name,
            'itemStyle': {
                'areaColor': '#dddddd',
                'borderColor': bc,
                'borderWidth': bw
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': area,
                    'borderColor': bc,
                    'borderWidth': bw
                }
            },
            'select': {
                'itemStyle': {
                    'areaColor': area
                }
            }
        };
    }

    /**
     * Convert myRegion list to MapRegionen array.
     *
     * @param regionen Regionen Object
     * @param myregion FindMyRegion Region
     * @param selectionList List of selected Regions
     * @param lighten (default false) Lighten the areaColor
     * @returns MapRegionen array
     */
    static getMyMapRegionen(regionen: any, myregion: any = null, selectionList: any = null, lighten: any = false) {
        const res = new Array<any>();
        const keys = Object.keys(regionen);
        for (let i = 0; i < keys.length; i++) {
            let bw = 1;
            let bc = '#333333';

            if (myregion !== undefined && myregion !== null && myregion === keys[i]) {
                bw = 4;
                bc = '#ffffff';
            }

            const region = this.getMyMapRegionenGR(
                keys[i],
                bc,
                bw,
                ImmobilienHelper.convertColor(regionen[keys[i]].color)
            );

            if (lighten === true) {
                region['itemStyle']['areaColor'] = ImmobilienHelper.modifyColor(regionen[keys[i]].color, 0.85);
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
     * @param name
     * @param seriesType
     * @param zindex
     * @param seriesColor
     * @param labelFormatter
     * @param data
     */
    static generateSeriesGS(name: any, seriesType: any, zindex: any, seriesColor: any, labelFormatter: any, data: any) {
        return {
            'name': name,
            'type': seriesType,
            'smooth': false,
            'symbol': 'circle',
            'symbolSize': 4,
            'showAllSymbol': true,
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
            'label': {
                'show': true,
                'position': 'right',
                'formatter': labelFormatter
            },
            'data': data
        };
    }

    /**
     * Generate a Series object
     *
     * @param name Series Name
     * @param data Series data array
     * @param color Series color (Must be valid for convertColor)
     * @param labelFormatter Custom labelFormatter function
     * @param selectedChartLine Name of the selected chart line (for highlghting)
     * @param xIndex xAxisIndex (degfault 0) (see echarts api)
     * @param yIndex yAxisIndex (Default 0) (see echarts api)
     * @param seriesType SeriesTyp (default line) (see echarts api)
     * @returns echarts Series Object
     */
    static generateSeries(
        name: string,
        data: any,
        color: any,
        labelFormatter: any = null,
        selectedChartLine = '',
        xIndex = 0,
        yIndex = 0,
        seriesType = 'line'
    ) {

        let seriesColor = ImmobilienHelper.convertColor(color);
        let zindex = 0;

        if ((selectedChartLine !== '') && (selectedChartLine !== name)) {
            seriesColor = ImmobilienHelper.modifyColor(color, 0.9);
        } else {
            zindex = 1;
        }

        // Series Object
        const ret = this.generateSeriesGS(name, seriesType, zindex, seriesColor, labelFormatter, data);

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
     * @param offset Offset for ercentage calculation
     * @returns Data array
     */
    static generateDrawSeriesData(data: any, date = new Array<string>(), field: string | null = null, offset = 100) {

        // Empty data array
        const ret = new Array<any>();

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

                fval = ImmobilienHelper.parseStringAsFloat(val);
                fval = parseFloat((fval + (100 - offset)).toFixed(2));
                ret.push(fval);
            } else {
                ret.push(undefined);
            }
        }
        return ret;
    }


    /**
     * @param name
     * @param color
     * @param fontSizeBase
     * @param position
     * @param posX
     */
    static generateTextElement(name: string, color = '#000', fontSizeBase = 1.2, position = 0, posX?: any) {
        return {
            type: 'text',
            top: position * 1.5 * ImmobilienHelper.convertRemToPixels(fontSizeBase),
            left: posX,
            style: {
                fill: ImmobilienHelper.convertColor(color),
                textAlign: 'left',
                fontSize: ImmobilienHelper.convertRemToPixels(fontSizeBase),
                text: name
            }
        };
    }

    /**
     * @param radius
     * @param color
     * @param fontSizeBase
     * @param position
     * @param posX
     * @param bordercolor
     * @param border
     */
    static generateDotElement(
        radius = 4,
        color = '#fff',
        fontSizeBase = 1.2,
        position = 0,
        posX = 0,
        bordercolor = '#000',
        border = 0
    ) {
        return {
            type: 'circle',
            cursor: 'normal',
            shape: {
                cx: -2 * radius + posX * radius * 4,
                cy: position * 1.5 * ImmobilienHelper.convertRemToPixels(fontSizeBase)
                    + ImmobilienHelper.convertRemToPixels(fontSizeBase) / 2,
                r: radius
            },
            style: {
                fill: ImmobilienHelper.convertColor(color),
                stroke: ImmobilienHelper.convertColor(bordercolor),
                lineWidth: border
            }
        };

    }

    /**
     * @param regionen
     * @param modifyArray
     */
    static modifyRegionen(regionen: any, modifyArray: any[]) {

        const newRegionen = JSON.parse(JSON.stringify(regionen));

        for (let i = 0; i < modifyArray.length; i++) {
            for (let v = 0; v < modifyArray[i]['values'].length; v++) {
                if (newRegionen[modifyArray[i]['values'][v]] !== undefined) {
                    newRegionen[modifyArray[i]['values'][v]]['color'] = modifyArray[i]['colors'];
                }
            }
        }

        return newRegionen;
    }

    /**
     * dispatchMapSelect
     * @param obj obj
     * @param name name
     * @param select select
     */
    static dispatchMapSelect(obj: any, name: string, select: boolean) {
        // check if is function
        if (typeof obj.dispatchAction !== 'function') {
            return;
        }
        if (select) {
            // Select
            obj.dispatchAction({
                type: 'select',
                name: name
            });
        } else {
            // Unselect
            obj.dispatchAction({
                type: 'unselect',
                name: name
            });

        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
