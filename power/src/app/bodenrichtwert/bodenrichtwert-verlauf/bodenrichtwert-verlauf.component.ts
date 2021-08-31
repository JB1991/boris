/* eslint-disable max-lines */
import { Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild, SimpleChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { VerfahrensartPipe } from '@app/bodenrichtwert/pipes/verfahrensart.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';
import { ECharts, EChartsOption, init, LegendComponentOption, SeriesOption } from 'echarts';

export interface SeriesItem {
    stag: string;
    brw: string;
    nutzung: string;
    verg: string;
    verf: string;
    forwarded: boolean;
}

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe, VerfahrensartPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertVerlaufComponent implements OnChanges, AfterViewInit, OnDestroy {

    @Input() STICHTAGE?: string[];
    @Input() teilmarkt?: Teilmarkt;

    @ViewChild('echartsInst') echartsInst?: ElementRef;

    @Input() address?: Feature;

    @Input() features?: FeatureCollection;

    public echartsInstance?: ECharts;
    public animationFrameID?: number = undefined;
    public resizeSub?: ResizeObserver;

    // table data for screenreader
    public srTableData: Array<any> = [];
    public srTableHeader: Array<string> = [];

    seriesTemplate: Array<SeriesItem> = [
        { stag: '2012', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2013', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2014', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2015', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2016', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2017', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2018', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2019', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: '2020', brw: '', nutzung: '', verg: '', verf: '', forwarded: false },
        { stag: 'heute', brw: '', nutzung: '', verg: '', verf: '', forwarded: false }
    ];

    public chartOption: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: (params: any) => this.tooltipFormatter(params),
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
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        series: [],
    };

    constructor(
        private nutzungPipe: NutzungPipe,
        private verfahrensartPipe: VerfahrensartPipe,
        private datePipe: DatePipe,
        private decimalPipe: DecimalPipe
    ) { }

    /** @inheritdoc */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['features']) {
            this.clearChart();
            if (this.features && !changes['features'].firstChange) {
                this.features.features = this.filterByStichtag(this.features.features);
                this.generateChart(this.features.features);
                if (this.echartsInstance) {
                    this.echartsInstance.resize();
                }
            }
        }
    }

    /** @inheritdoc */
    public ngAfterViewInit() {
        if (this.echartsInst) {
            this.echartsInstance = init(this.echartsInst.nativeElement);

            this.resizeSub = new ResizeObserver(() => {
                this.animationFrameID = window.requestAnimationFrame(() => this.resize());
            });
            this.resizeSub.observe(this.echartsInst.nativeElement);
        }
    }

    /** @inheritdoc */
    public ngOnDestroy() {
        if (this.resizeSub) {
            this.resizeSub.disconnect();
            if (this.animationFrameID) {
                window.cancelAnimationFrame(this.animationFrameID);
            }
        }
    }

    /**
     * Resizes echart
     */
    public resize() {
        this.echartsInstance?.resize();
    }

    /**
     * clearChart clears the chartOptions
     */
    public clearChart(): void {
        this.chartOption.series = [];
        const legend: any = this.chartOption.legend;
        legend['data'] = [];
        legend['formatter'] = '';
        legend['textStyle'].rich = '';

        this.srTableHeader = [];
        this.srTableData = [];
    }

    /**
     * tooltipFormatter formats the content of the tooltip floating layer
     * @param params params
     * @returns returns the adjusted tooltip
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
                let value: string;
                if (this.teilmarkt?.text === 'Bauland') {
                    value = this.decimalPipe.transform(params[j].value, '1.0-1') as string;
                } else {
                    value = this.decimalPipe.transform(params[j].value, '1.2-2') as string;
                }
                // result with modified tooltip text
                res.push(`${params[j].marker} ${params[j].seriesName} : ${value} € <br />`);
            }
        }

        let isSet = false;
        let smallestDiff: number;
        let index = 0;

        this.STICHTAGE?.forEach((v, i) => {
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

        return ([this.datePipe.transform(this.STICHTAGE?.[index]), '<br />', res.join('')].join(''));
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
     * @returns returns the filtered features
     */
    public filterByStichtag(features: Array<Feature>): Array<Feature> {
        const firstYear = this.seriesTemplate[0].stag;
        const lastYear = this.seriesTemplate[this.seriesTemplate.length - 1].stag;

        return features.filter((ft: Feature) =>
            ft.properties?.['stag'].substr(0, 4) >= firstYear && ft.properties?.['stag'].substr(0, 4) <= lastYear
        );
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
                if (this.chartOption.legend) {
                    const legend = this.chartOption.legend as LegendComponentOption;
                    legend?.data?.push(label);
                }
                this.setChartOptionsSeries(series, label);
                this.generateSrTable(label, series);
            });
            this.setLegendFormat();
            this.setTextStyleOfLegend();
        }
        this.echartsInstance?.setOption(Object.assign(this.chartOption, this.chartOption), true);
    }

    /**
     * getKeyValuePairs grouped the feature items by the name of the Nutzungsart or the Bodenrichtwertnummer
     * @param features feature array
     * @returns the feature items grouped
     */
    public getKeyValuePairs(features: Array<Feature>): Map<string, Array<Feature>> {
        // grouped by Nutzungsart
        let groupedByProperty: Map<string, Array<Feature>> =
            this.groupBy(features, (item: Feature) => this.nutzungPipe.transform(item.properties?.['nutzung']));
        for (const [_, value] of groupedByProperty.entries()) {
            for (const seriesTuple of this.seriesTemplate) {
                const valuesFiltered = value.filter((item: Feature) =>
                    item.properties?.['stag'].substring(0, 4) === seriesTuple.stag);
                if (valuesFiltered.length > 1) {
                    // grouped by Bodenrichtwertnummer
                    groupedByProperty = this.groupBy(features, (item: Feature) => item.properties?.['wnum']);
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
     * @returns returns a map object
     */
    public groupBy(list: Array<Feature>, keyGetter: (item: Feature) => string): Map<string, Array<Feature>> {
        const map = new Map<string, Array<Feature>>();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (key !== null && key !== '') {
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
            const feature = features.find(f => f.properties?.['stag'].includes(series[i].stag));
            if (feature) {
                series[i].brw = feature.properties?.['brw'];
                series[i].nutzung = this.nutzungPipe.transform(feature.properties?.['nutzung']);
                series[i].verg = feature.properties?.['verg'];
                series[i].verf = feature.properties?.['verf'];
            }
        }
        return series;
    }

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
            const seriesIncludesVerf = series.find(element => element.verg === verg && (element.verf === 'SU' || element.verf === 'EU' ||
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
                    const seriesIncludesCurrentVerf = seriesVergValues.find((element: any) => element.verf === verf);
                    const seriesIncludesCurrentVerg = seriesVergValues.find((element: any) => element.verg === verg);
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
                const seriesIncludesCurrentVerg = seriesVergValues.find((element: any) => element.verg === verg);
                if (seriesIncludesCurrentVerg) {
                    seriesVergValuesTotal.push(seriesVergValues);
                }
            }
        });
        return seriesVergValuesTotal;
    }


    /**
     * copySeriesData copies the series items into a new array
     * @param series array with series items
     * @param seriesVergValues array with series items which hold verg values
     * @param idx index
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
     * fillGapWithinAYear fills a gap within a year if the series is interrupted and reused at a later time
     * @param series series
     * @returns a series with filled gaps
     */
    public fillGapWithinAYear(series: Array<SeriesItem>) {
        // check gap in series
        const seriesFilledGap: Array<SeriesItem> = this.deepCopy(this.seriesTemplate);
        let i = -1;
        do {
            i++;
            let j = i + 1;
            do {
                j++;
                // fill graph
                if (series[i].brw !== null && series[i + 1].brw === null && series[j].brw !== null && typeof (series[i].brw) !== 'string') {
                    seriesFilledGap[i].brw = (series[i].brw).toString();
                    seriesFilledGap[i].nutzung = series[i].nutzung;
                    seriesFilledGap[i].verf = series[i].verf;
                    seriesFilledGap[i + 1].brw = (series[i].brw).toString();
                    seriesFilledGap[i + 1].nutzung = series[i].nutzung;
                    seriesFilledGap[i + 1].verf = series[i].verf;
                    seriesFilledGap[i + 1].forwarded = true;
                }
            } while (series[j].brw === null && j < (series.length - 1));
        } while (typeof (seriesFilledGap[i + 1].brw) !== 'string' && i < (series.length - 3));
        return seriesFilledGap;
    }

    /**
     * copyLastItem copies the last item of the series into the same array one index higher
     * @param series array with series items
     * @returns the series including the last item copied
     */
    public copyLastItem(series: Array<SeriesItem>) {
        // Forwarding the last element of the series
        const seriesValues = series.filter(element => element.brw);
        if (seriesValues.length > 0 && typeof (seriesValues[seriesValues.length - 1]).brw !== 'string') {
            const lastItemStag = seriesValues[seriesValues.length - 1].stag;
            const idx = series.findIndex(element => element.stag === lastItemStag);
            series[idx + 1].brw = (series[idx].brw).toString();
            series[idx + 1].nutzung = series[idx].nutzung;
            series[idx + 1].verg = series[idx].verg;
            series[idx + 1].verf = series[idx].verf;
            series[idx + 1].forwarded = true;
        }
        return series;
    }

    /**
     * deleteSeriesVergItems removes the verg attribute of a given series
     * @param series series
     * @returns returns the series without verfahrensgrund items
     */
    public deleteSeriesVergItems(series: Array<SeriesItem>): Array<SeriesItem> {
        let i = 0;
        if (series.find((element: any, index: number): boolean => {
            // find first series element with no verg and brw
            if (!element.verg && element.brw) {
                i = index;
                return true;
            }
            return false;
        })) {
            // from no Verfahrensgrund set to a set Verfahrensgrund
            for (i; i < series.length; i++) {
                if (series[i].verg) {
                    series[i].verg = '';
                    series[i].verf = '';
                    series[i].nutzung = '';
                    // if series gets interrupted cause of a verg the two graphs should be connected
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    series[i - 1].brw ? series[i].brw = (series[i].brw).toString() : series[i].brw = '';
                    series = series.slice(0, i + 1);
                    break;
                }
            }
        }
        // if Verfahrensgrund is in the past
        series.forEach(element => element.verg ? [element.nutzung, element.brw, element.verg, element.verf] = ['', '', '', ''] : '');
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
            symbolSize: function (value: any) {
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
        let nutzung = (series.find(seriesItem => seriesItem.nutzung !== null && seriesItem.nutzung !== ''))?.nutzung as string;
        const wnum = Number(key);
        if (wnum && nutzung) {
            nutzung += '\n' + wnum;
        }
        let seriesIncludesVerg = false;
        series.forEach(element => {
            if (element.verg && element.verg !== null && element.verg !== '') {
                seriesIncludesVerg = true;
            }
        });
        if (seriesIncludesVerg) {
            const verg = series.find(el => el.verg !== '' && el.verg !== null);
            let verf = new Array<string>();
            series.filter(el => {
                if (el.verf !== '' && el.verf !== null) {
                    verf.push(el.verf);
                }
            });
            verf = verf.filter((el, idx, self) => idx === self.indexOf(el));
            nutzung += '\n' + this.verfahrensartPipe.transform(verg?.verg as any);
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
        const legend = this.chartOption.legend as LegendComponentOption;
        legend['formatter'] = function (name: string) {
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
        const legend: any = this.chartOption.legend;
        legend.textStyle.rich = {
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
        indexes.forEach(idx => series[idx].brw = '');
        if (label) {
            this.srTableHeader.push(label);
            this.srTableData.push({ series: series });
        }
    }

    /**
     * deepCopy
     * @param data array with seriesItems
     * @returns returns JSON object
     */
    public deepCopy(data: Array<SeriesItem>) {
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * getStichtag calculates the correct stichtag for bremerhaven or bremen
     * @param l string 'Bremen' or 'Bremerhaven'
     * @returns returns the correct stichtag for bremerhaven or bremen
     */
    public getStichtag(l: 'BREMEN' | 'BREMERHAVEN'): string {
        if (!this.STICHTAGE) {
            return '';
        }
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

    /**
     * Returns echart options series
     * @returns SeriesOption[]
     */
    public getSeriesOption(): SeriesOption[] {
        if (this.chartOption.series) {
            return this.chartOption.series as SeriesOption[];
        }
        return new Array<SeriesOption>();
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
