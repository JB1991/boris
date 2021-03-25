/* eslint-disable max-lines */
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { VerfahrensartPipe } from '@app/bodenrichtwert/pipes/verfahrensart.pipe';
import { DatePipe } from '@angular/common';

export interface SeriesItem {
    stag: string;
    brw: string;
    nutzung: string;
    verg: string;
    verf: string;
}

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe, VerfahrensartPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

    @Input() STICHTAGE: string[];

    // table data for screenreader
    public srTableData: Array<any> = [];
    public srTableHeader: Array<string> = [];

    seriesTemplate: Array<SeriesItem> = [
        { stag: '2012', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2013', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2014', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2015', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2016', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2017', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2018', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2019', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2020', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: 'heute', brw: null, nutzung: '', verg: '', verf: '' }
    ];

    public chartOption: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: (params: Array<any>) => this.tooltipFormatter(params),
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
        },
        legend: {
            data: [],
            type: 'scroll',
            formatter: '',
            top: '1%',
            textStyle: {
                rich: {}
            },
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
            nameLocation: 'start',
            axisLine: {
                symbol: ['none', 'arrow'],
                symbolSize: [10, 9],
                symbolOffset: [0, 11]
            },
            axisTick: {
                alignWithLabel: true
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} €/m²',
            },
            axisLine: {
                show: true,
                symbol: ['none', 'arrow'],
                symbolSize: [10, 9],
                symbolOffset: [0, 11]
            }
        },
        series: [],
    };

    @Input() address: Feature;

    @Input() features: FeatureCollection;

    public echartsInstance: any;

    constructor(
        private nutzungPipe: NutzungPipe,
        private verfahrensartPipe: VerfahrensartPipe,
        private datePipe: DatePipe
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.features) {
            this.clearChart();
            if (this.features) {
                this.features.features = this.filterByStichtag(this.features.features);
                this.generateChart(this.features.features);
            }
        }
    }
    /**
     * onChartInit initializes the chart
     */
    public onChartInit(event: any): void {
        this.echartsInstance = event;
    }

    /**
     * clearChart clears the chartOptions
     */
    public clearChart(): void {
        this.chartOption.series = [];
        this.chartOption.legend['data'] = [];
        this.chartOption.legend['formatter'] = '';
        this.chartOption.legend['textStyle'].rich = '';
        this.srTableHeader = [];
        this.srTableData = [];
    }

    /**
     * tooltipFormatter formats the content of the tooltip floating layer
     * @param params params
     */
    public tooltipFormatter(params: Array<any>): string {
        const res = [];
        const year: number = params[0].axisValue;
        for (let j = 0; j < params.length; j++) {
            if (params[j].value && typeof (params[j].value) !== 'string') {
                params[j].seriesName = this.removeTextInTooltip(params[j].seriesName);
                if (window.innerWidth < 480 && params[j].seriesName.length > 25) {
                    params[j].seriesName = this.formatTooltipforSmallViews(params[j].seriesName);
                }
                // result with modified tooltip text
                res.push(`${params[j].marker} ${params[j].seriesName} : ${params[j].value} € <br />`);
            }
        }

        let isSet = false;
        let smallestDiff: number;
        let index: number;

        this.STICHTAGE.forEach((v, i) => {
            const diff = Math.abs(new Date(year + '-01-01').getTime() - new Date(v).getTime());
            if (!isSet) {
                smallestDiff = diff;
                index = i;
                isSet = true;
                return;
            }
            if (diff < smallestDiff) {
                smallestDiff = diff;
                index = i;
            }
        });

        return ([this.datePipe.transform(this.STICHTAGE[index]), '<br />', res.join('')].join(''));
    }

    /**
     * removesStringInTooltip removes the text of verfahrensgrund (San, Entw, SoSt, StUb)
     * and verfharensart(SU, EU, SB, EB)
     * @param tooltipText string
     * @returns a string with modified tooltip text
     */
    public removeTextInTooltip(tooltipText: string): string {
        tooltipText = tooltipText.replace('Sanierungsgebiet', '');
        tooltipText = tooltipText.replace('Entwicklungsbereich', '');
        tooltipText = tooltipText.replace('Soziale Stadt', '');
        tooltipText = tooltipText.replace('Stadtumbau', '');
        tooltipText = tooltipText.replace('sanierungsunbeeinflusster Wert', '');
        tooltipText = tooltipText.replace('sanierungsbeeinflusster Wert', '');
        return tooltipText;
    }

    /**
     * formatTooltipforSmallViews formats the tooltip specially needed for small Viewports
     * @param tooltipText string
     * @returns a string with modified tooltip text
     */
    public formatTooltipforSmallViews(tooltipText: string): string {
        const splittedName: Array<string> = tooltipText.split(/(?:\n| )/);
        const concatSplittedName: Array<string> = [];
        splittedName.forEach((textElement: string) => {
            const idx = concatSplittedName.length - 1;
            // for first text element
            if (!concatSplittedName[idx]) {
                concatSplittedName.push(textElement + ' ');
                // Add text to array until length of < 23 else push to new index
            } else if (concatSplittedName[idx].length < 23) {
                concatSplittedName[idx] += textElement + ' ';
            } else {
                concatSplittedName.push(textElement + ' ');
            }
        });
        return concatSplittedName.join('<br />');
    }

    /**
     * filterByStichtag filters out the features between the first and last year of the series
     * @param features features
     */
    public filterByStichtag(features: Array<Feature>): Array<Feature> {
        const firstYear = this.seriesTemplate[0].stag;
        const lastYear = this.seriesTemplate[this.seriesTemplate.length - 1].stag;

        const filteredFts = features.filter((ft: Feature) =>
            ft.properties.stag.substr(0, 4) >= firstYear && ft.properties.stag.substr(0, 4) <= lastYear
        );
        return filteredFts;
    }

    /**
     * generateChart generates a chart for given features
     * @param features features
     */
    public generateChart(features: Array<Feature>): void {
        const groupedByProperty = this.getKeyValuePairs(features);
        for (const [key, value] of groupedByProperty.entries()) {
            const seriesArray: Array<Array<SeriesItem>> = [];
            features = Array.from(value);

            seriesArray[0] = this.getSeriesData(features);
            this.getVergOfSeries(seriesArray[0]).forEach(element => {
                seriesArray.push(element);
            });
            seriesArray[0] = this.deleteSeriesVergItems(seriesArray[0]);
            let label: string;
            seriesArray.forEach((series) => {
                label = this.createLegendLabel(key, series);
                this.chartOption.legend['data'].push(label);
                this.setChartOptionsSeries(series, label);
                this.generateSrTable(label, series);
            });
            this.setLegendFormat();
            this.setTextStyleOfLegend();
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
    }

    /**
     * getKeyValuePairs grouped the feature items by the name of the Nutzungsart or the Bodenrichtwertnummer
     * @param features
     * @returns the feature items grouped
     */
    public getKeyValuePairs(features: Array<Feature>): Map<string, Array<Feature>> {
        // grouped by Nutzungsart
        let groupedByProperty: Map<string, Array<Feature>> =
            this.groupBy(features, (item: Feature) => this.nutzungPipe.transform(item.properties.nutzung));
        for (const [key, value] of groupedByProperty.entries()) {
            for (const seriesTuple of this.seriesTemplate) {
                const valuesFiltered = value.filter((item: Feature) =>
                    item.properties.stag.substring(0, 4) === seriesTuple.stag);
                if (valuesFiltered.length > 1) {
                    // grouped by Bodenrichtwertnummer
                    groupedByProperty = this.groupBy(features, (item: Feature) => item.properties.wnum);
                    break;
                }
            }
        }
        return groupedByProperty;
    }

    /**
     * groupBy groups a given feature array by a specific callback function
     * @param list feature array
     * @param keyGetter keyGetter
     */
    public groupBy(list: Array<Feature>, keyGetter: (item: Feature) => string): Map<string, Array<Feature>> {
        const map = new Map<string, Array<Feature>>();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (key !== null) {
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            }
        });
        return map;
    }

    /**
     * getSeriesData gets the series items of the feature and copies them into a new array
     * @param features features
     * @returns a series with feature values
     */
    public getSeriesData(features: Array<Feature>): Array<SeriesItem> {
        const series = this.deepCopy(this.seriesTemplate);
        for (let i = 0; i < series.length; i++) {
            const feature = features.find(f => f.properties.stag.includes(series[i].stag));
            if (feature) {
                series[i].brw = feature.properties.brw;
                series[i].nutzung = this.nutzungPipe.transform(feature.properties.nutzung, null);
                series[i].verg = feature.properties.verg;
                series[i].verf = feature.properties.verf;
            }
        }
        return series;
    };

    /**
     * getVergOfSeries extracts the Verfahrensgrund (San, Entw, Sost, StUb) if existing from the series
     * @param series series
     * @returns the separated series which includes Verfahrensgrund and Verfahrensart
     */
    public getVergOfSeries(series: Array<SeriesItem>): Array<Array<SeriesItem>> {
        const defaultVerg: Array<string> = ['San', 'Entw', 'SoSt', 'StUb'];
        const defaultVerf: Array<string> = ['SU', 'EU', 'SB', 'EB'];
        const seriesVergValuesTotal: Array<Array<SeriesItem>> = [];
        let seriesVergValues;

        // extract each Verfahrensgrund
        defaultVerg.forEach(verg => {
            seriesVergValues = this.deepCopy(this.seriesTemplate);
            const seriesIncludesVerf: SeriesItem = series.find(element => element.verg === verg && (element.verf === 'SU' || element.verf === 'EU' ||
                element.verf === 'SB' || element.verf === 'EB'));
            if (seriesIncludesVerf) {
                // separates each Verfahrensart of Verfahrensgrund
                defaultVerf.forEach(verf => {
                    seriesVergValues = this.deepCopy(this.seriesTemplate);
                    // goes through the series and gets the items with Verfahrensgrund and Verfahrensart
                    for (let i = 0; i < series.length; i++) {
                        if (series[i].verg === verg && (series[i].verf === verf || series[i].verf === null)) {
                            seriesVergValues = this.copySeriesData(series, seriesVergValues, i);
                        }
                    }
                    const seriesIncludesCurrentVerf = seriesVergValues.find(element => element.verf === verf);
                    const seriesIncludesCurrentVerg = seriesVergValues.find(element => element.verg === verg);
                    if (seriesIncludesCurrentVerg && seriesIncludesCurrentVerf) {
                        seriesVergValuesTotal.push(seriesVergValues);
                    }
                });
                // if no Verfahrensart exists
            } else {
                for (let i = 0; i < series.length; i++) {
                    if (series[i].verg === verg) {
                        seriesVergValues = this.copySeriesData(series, seriesVergValues, i);
                    }
                }
                const seriesIncludesCurrentVerg = seriesVergValues.find(element => element.verg === verg);
                if (seriesIncludesCurrentVerg) {
                    seriesVergValuesTotal.push(seriesVergValues);
                }
            }
        });
        return seriesVergValuesTotal;
    }


    /**
     * copySeriesData copies the series items into a new array
     * @param series
     * @param seriesVergValues
     * @param idx
     * @returns the series copied into new array
     */
    public copySeriesData(series: Array<SeriesItem>,
        seriesVergValues: Array<SeriesItem>, idx: number): Array<SeriesItem> {
        // series changes from a verg to normal
        if (idx < (series.length - 1) && series[idx + 1].brw !== null &&
         (series[idx + 1].verg === '' || series[idx + 1].verg === null)) {
            seriesVergValues[idx + 1].brw = (series[idx + 1].brw).toString();
            seriesVergValues[idx + 1].nutzung = series[idx + 1].nutzung;
            seriesVergValues = seriesVergValues.slice(0, idx + 2);

        }
        seriesVergValues[idx].brw = series[idx].brw;
        seriesVergValues[idx].nutzung = series[idx].nutzung;
        seriesVergValues[idx].verg = series[idx].verg;
        seriesVergValues[idx].verf = series[idx].verf;
        return seriesVergValues;
    }

    /**
     * deleteSeriesVergItems removes the verg attribute of a given series
     * @param series series
     */
    public deleteSeriesVergItems(series: Array<SeriesItem>): Array<SeriesItem> {
        let i: number;
        if (series.find((element, index) => {
            // find first series element with no verg and brw
            if ((element.verg === '' || element.verg === null) && element.brw !== null) {
                i = index;
                return true;
            }
        })
        ) {
            // from no Verfahrensgrund set to a set Verfahrensgrund
            for (i; i < series.length; i++) {
                if (series[i].verg) {
                    series[i].verg = null;
                    series[i].verf = null;
                    series[i].nutzung = null;
                    // if series gets interrupted cause of a verg the two graphs should be connected
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    series[i - 1].brw? series[i].brw = (series[i].brw).toString() : series[i].brw = null;
                    series = series.slice(0, i + 1);
                    return series;
                }
            }
        }
        // if Verfahrensgrund is in the past
        series.forEach(element => element.verg? [element.verg, element.brw, element.nutzung, element.verf] = [null, null, null, null] : '');
        return series;
    }

    /**
     * setChartOptionsSeries formats the options for the series items
     * @param series array with seriesItems
     * @param label label
     */
    public setChartOptionsSeries(series: Array<SeriesItem>, label: string): void {
        (this.chartOption.series as Array<SeriesOption>).push({
            name: label,
            type: 'line',
            step: 'end',
            symbolSize:  function (value: any) {
                if (typeof (value) === 'string') {
                    return 0;
                } else {
                    return 4;
                }
            },
            data: series.map(t => t.brw),
        });
    }

    /**
     * getLabel creates the labels for the legend block for each series
     * @param key key
     * @param series array with seriesItems
     * @returns the label for the legend
     */
    public createLegendLabel(key: string, series: Array<SeriesItem>): string {
        let nutzung: string = (series.find(seriesItem => seriesItem.nutzung !== null && seriesItem.nutzung !== ''))?.nutzung;
        const wnum = Number(key);
        if (wnum && nutzung) {
            nutzung += '\n' + wnum;
        }
        let seriesIncludesVerg: boolean;
        series.forEach(element => {
            if (element.verg && element.verg !== null && element.verg !== '') {
                seriesIncludesVerg = true;
            }
        });
        if (seriesIncludesVerg) {
            let verg = series.find(el => el.verg !== '' && el.verg !== null);
            let verf = [];
            series.filter(el => {
                if (el.verf !== '' && el.verf !== null) {
                    verf.push(el.verf);
                }
            });
            verf = verf.filter((el, idx, self) => idx === self.indexOf(el));
            verg = this.verfahrensartPipe.transform(verg.verg, null);
            nutzung += '\n' + verg;
            if (verf) {
                verf.forEach(verfItem => {
                    if (verfItem === 'SB') {
                        nutzung += '\n' + 'sanierungsbeeinflusster Wert';
                    } else if (verfItem === 'SU') {
                        nutzung += '\n' + 'sanierungsunbeeinflusster Wert';
                    } else if (verfItem === 'EB') {
                        nutzung += '\n' + 'entwicklungsbeeinflusster Wert';
                    } else if (verfItem === 'EU') {
                        nutzung += '\n' + 'entwicklungsunbeeinflusster Wert';
                    }
                });
                return nutzung;
            }
        }
        return nutzung;
    }


    /**
     * setLegendFormat formats the labels of the legend block
     */
    /* eslint-disable complexity */
    public setLegendFormat() {
        this.chartOption.legend['formatter'] = function (name: string) {
            const splittedName = name.split('\n');
            const verg = splittedName.find(item => item === 'Sanierungsgebiet' || item === 'Entwicklungsbereich' || item === 'Soziale Stadt' || item === 'Stadtumbau');
            const verf = splittedName.find(item => item === 'sanierungsbeeinflusster Wert' || item === 'sanierungsunbeeinflusster Wert' || item === 'entwicklungsbeeinflusster Wert' || item === 'entwicklungsunbeeinflusster Wert');
            const wnum = splittedName.find(item => Number(item));
            if (verf && wnum) {
                return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`, [[`{verg|${verg}}`, `{verf|(${verf})}`].join('\n')].join('')].join('\n');
            }
            if (verf && verf !== '') {
                return [`{nutzung|${splittedName[0]}}`, `{verg|${verg}}`, `{verf|(${verf})}`].join('\n');
            }
            if (wnum && (verg === 'Sanierungsgebiet' || verg === 'Entwicklungsbereich' || verg === 'Soziale Stadt' || verg === 'Stadtumbau')) {
                return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`, `{verg|${verg}}`].join('\n');
            }
            if (verg === 'Sanierungsgebiet' || verg === 'Entwicklungsbereich' || verg === 'Soziale Stadt' || verg === 'Stadtumbau') {
                return [`{nutzung|${splittedName[0]}}`, `{verg|${verg}}`].join('\n');
            }
            if (wnum) {
                return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`].join('\n');
            }
            return name;
        };
    }

    /**
     * setTextStyleOfLegend sets some styling elements of the legend items
     */
    public setTextStyleOfLegend() {
        this.chartOption.legend['textStyle'].rich = {
            'nutzung': {
                padding: [0, 0, 0, 0],
                align: 'center'
            },
            'verg': {
                fontSize: 10,
                padding: [0, 0, 4, 0],
                align: 'center'
            },
            'verf': {
                fontSize: 10,
                padding: [0, 0, 3, 0],
                align: 'center'
            },
            'wnum': {
                fontSize: 10,
                align: 'center'
            },
        };
    }

    /**
     * generateSrTable generates the table for screenreader
     * @param label label
     * @param series array with seriesItems
     */
    public generateSrTable(label: string, series: Array<SeriesItem>): void {
        const indexes: Array<number> = [];
        indexes.forEach(idx => series[idx].brw = null);
        if (label) {
            this.srTableHeader.push(label);
            this.srTableData.push({ series: series });
        }
    }

    /**
     * deepCopy
     * @param data array with seriesItems
     */
    public deepCopy(data: Array<SeriesItem>) {
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * getStichtag returns the correct stichtag for bremerhaven or bremen
     */
    public getStichtag(l: 'BREMEN' | 'BREMERHAVEN'): string {
        if (new Date().getFullYear() % 2 !== 0) {
            if (l === 'BREMERHAVEN') {
                return this.STICHTAGE[1];
            }
            return this.STICHTAGE[0];
        } else {
            if (l === 'BREMERHAVEN') {
                return this.STICHTAGE[0];
            }
            return this.STICHTAGE[1];
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
