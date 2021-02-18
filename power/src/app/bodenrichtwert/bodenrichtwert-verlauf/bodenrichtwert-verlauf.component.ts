/* eslint-disable max-lines */
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { EChartOption } from 'echarts';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { VerfahrensartPipe } from '@app/bodenrichtwert/pipes/verfahrensart.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe, VerfahrensartPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

    state: any;

    // screenreader
    srTableData: Array<any> = [];
    srTableHeader: Array<string> = [];

    seriesTemplate = [
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

    public chartOption: EChartOption = {
        tooltip: {
            trigger: 'axis',
            confine: 'true',
            formatter: function (params) {
                const res = [];
                const year = params[0].axisValue;
                for (let j = 0; j < params.length; j++) {
                    if (params[j].value !== undefined && typeof (params[j].value) !== 'string') {
                        let seriesName = params[j].seriesName;
                        seriesName = seriesName.replace('Sanierungsgebiet', '');
                        seriesName = seriesName.replace('Entwicklungsbereich', '');
                        seriesName = seriesName.replace('Soziale Stadt', '');
                        seriesName = seriesName.replace('Stadtumbau', '');
                        seriesName = seriesName.replace('sanierungsunbeeinflusster Wert', '');
                        seriesName = seriesName.replace('sanierungsbeeinflusster Wert', '');
                        if (window.innerWidth < 480 && seriesName.length > 25) {
                            const splittedNameSmallView = seriesName.split(/(?:\n| )/);
                            const concatSplittedName = [];
                            let i = 0;
                            splittedNameSmallView.forEach((element) => {
                                if (!concatSplittedName[i]) {
                                    concatSplittedName[i] = element + ' ';
                                } else if (concatSplittedName[i].length < 23) {
                                    concatSplittedName[i] += element + ' ';
                                } else {
                                    i++;
                                    if (!concatSplittedName[i]) {
                                        concatSplittedName[i] = element + ' ';
                                    } else { concatSplittedName[i] += element + ' '; }
                                }
                            });
                            const resName = concatSplittedName.join('<br />');
                            res.push(`${params[j].marker} ${resName} : ${params[j].value} € <br />`);
                        } else {
                            res.push(`${params[j].marker} ${seriesName} : ${params[j].value} € <br />`);
                        }
                    }
                }
                return ([year, '<br />', res.join('')].join(''));
            },
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
            top: '0%',
            formatter: '',
            textStyle: {
                rich: {}
            },
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
            nameLocation: 'start',
            axisLine: {
                symbol: ['none', 'arrow'],
                symbolSize: [10, 9],
                symbolOffset: [0, 6]
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
                symbol: ['none', 'arrow'],
                symbolSize: [10, 9],
                symbolOffset: [0, 11]
            }
        },
        series: [],
    };

    @Input() adresse: Feature;

    @Input() features: FeatureCollection;

    echartsInstance;

    constructor(
        private nutzungPipe: NutzungPipe,
        private verfahrensartPipe: VerfahrensartPipe
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.features) {
            if (this.features) {
                this.clearChart();
                this.features.features = this.filterByStichtag(this.features.features);
                this.generateChart(this.features.features);
            }
        }
    }

    clearChart(): void {
        this.chartOption.series = [];
        this.chartOption.legend.data = [];
        this.chartOption.legend.formatter = '';
        this.chartOption.legend.textStyle.rich = '';
        this.chartOption.grid.top = '10%';
        this.srTableHeader = [];
        this.srTableData = [];
    }

    filterByStichtag(features: Array<any>): Array<any> {
        const filteredFeatures = [];
        for (const feature of features) {
            const year = feature.properties.stag.substring(0, 4);
            if (year >= 2012 && year <= 2020) {
                filteredFeatures.push(feature);
            }
        }
        return filteredFeatures;
    }

    generateChart(features: Array<any>): void {
        // grouped by Nutzungsart
        let groupedByProperty: Map<Array<any>, any> =
            this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));
        for (const [key, value] of groupedByProperty.entries()) {
            for (const seriesTuple of this.seriesTemplate) {
                const valuesFiltered = value.filter(item => item.properties.stag.substring(0, 4) === seriesTuple.stag);
                if (valuesFiltered.length > 1) {
                    // grouped by Bodenrichtwertnummer
                    groupedByProperty = this.groupBy(features, item => item.properties.wnum);
                    break;
                }
            }
        }
        for (const [key, value] of groupedByProperty.entries()) {
            const seriesArray: Array<any> = [];
            features = Array.from(value);

            seriesArray[0] = this.getSeriesData(features);
            this.getVergSeries(seriesArray[0]).forEach(element => {
                seriesArray.push(element);
            });
            this.deleteSeriesVergItems(seriesArray[0]);

            let label;
            seriesArray.forEach((series) => {
                let seriesFillLine;
                [series, seriesFillLine] = this.fillLineDuringYear(series);
                label = this.getLabel(key, series);
                this.chartOption.legend.data.push(label);
                this.setChartOptionsSeries(series, label);
                if (seriesFillLine.find(item => item.brw !== null)) {
                    this.setChartOptionsSeries(seriesFillLine, label);
                }
                this.generateSrTable(label, series);
            });
            this.setLegendFormat();
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
    }

    getSeriesData(features: Array<any>): Array<any> {
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

    getVergSeries(series: Array<any>): Array<any> {
        const seriesVergValuesTotal: Array<Array<any>> = [];
        let seriesVergValues = this.deepCopy(this.seriesTemplate);
        const defaultVerg: Array<string> = ['San', 'Entw', 'SoSt', 'StUb'];
        const defaultVerf: Array<string> = ['SU', 'EU', 'SB', 'EB'];
        const copyData = function (i) {
            if (i < 8 && series[i + 1].brw !== null && (series[i + 1].verg === '' || series[i + 1].verg === null)) {
                seriesVergValues[i + 1].brw = (series[i + 1].brw).toString();
                seriesVergValues[i + 1].nutzung = series[i + 1].nutzung;
            }
            seriesVergValues[i].brw = series[i].brw;
            seriesVergValues[i].nutzung = series[i].nutzung;
            seriesVergValues[i].verg = series[i].verg;
            seriesVergValues[i].verf = series[i].verf;
        };
        defaultVerg.forEach(verg => {
            seriesVergValues = this.deepCopy(this.seriesTemplate);
            const seriesIncludesVerf = series.find(element => element.verg === verg && (element.verf === 'SU' || element.verf === 'EU' ||
                element.verf === 'SB' || element.verf === 'EB'));
            if (seriesIncludesVerf) {
                defaultVerf.forEach(verf => {
                    seriesVergValues = this.deepCopy(this.seriesTemplate);
                    for (let i = 0; i < series.length; i++) {
                        if (series[i].verg === verg && (series[i].verf === verf || series[i].verf === null)) {
                            copyData(i);
                        }
                    }
                    const seriesIncludesCurrentVerf = seriesVergValues.find(element => element.verf === verf);
                    const seriesIncludesCurrentVerg = seriesVergValues.find(element => element.verg === verg);
                    if (seriesIncludesCurrentVerg && seriesIncludesCurrentVerf) {
                        seriesVergValuesTotal.push(seriesVergValues);
                    }
                });
            } else {
                for (let i = 0; i < series.length; i++) {
                    if (series[i].verg === verg) {
                        copyData(i);
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

    getLabel(key, series: Array<any>): string {
        let nutzung: string = (series.find(seriesItem => seriesItem.nutzung !== null && seriesItem.nutzung !== ''))?.nutzung;
        const wnum = Number(key);
        if (wnum && nutzung) {
            nutzung += '\n' + wnum;
        }
        let seriesIncludesVerg;
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

    /* eslint-disable complexity */
    fillLineDuringYear(series: Array<any>): [Array<any>, Array<any>] {
        // check gap in same series
        const seriesFillLine: Array<any> = this.deepCopy(this.seriesTemplate);
        let i = -1;
        do {
            i++;
            let j = i + 1;
            do {
                j++;
                // fill graph
                if (series[i].brw !== null && series[i + 1].brw === null && series[j].brw !== null && typeof (series[i].brw) !== 'string') {
                    seriesFillLine[i].brw = (series[i].brw).toString();
                    seriesFillLine[i].nutzung = series[i].nutzung;
                    seriesFillLine[i].verf = series[i].verf;
                    seriesFillLine[i + 1].brw = (series[i].brw).toString();
                    seriesFillLine[i + 1].nutzung = series[i].nutzung;
                    seriesFillLine[i + 1].verf = series[i].verf;
                    seriesFillLine[i + 1].forwarded = true;
                }
            } while (series[j].brw === null && j < (series.length - 1));
        } while (typeof (seriesFillLine[i + 1].brw) !== 'string' && i < (series.length - 3));
        // Forwarding the last element of the series
        let seriesValues = series.filter(element => element.brw);
        if (seriesValues.length > 0 && typeof (seriesValues[seriesValues.length - 1]).brw !== 'string') {
            seriesValues = seriesValues[seriesValues.length - 1].stag;
            const idx = series.findIndex(element => element.stag === seriesValues);
            series[idx + 1].brw = (series[idx].brw).toString();
            series[idx + 1].nutzung = series[idx].nutzung;
            series[idx + 1].verg = series[idx].verg;
            series[idx + 1].verf = series[idx].verf;
            series[idx + 1].forwarded = true;
        }
        return [series, seriesFillLine];
    }

    deleteSeriesVergItems(series: Array<any>): Array<any> {
        let i: number;
        if (series.find((element, index) => {
            if ((element.verg === '' || element.verg === null) && element.brw !== null) {
                i = index;
                return true;
            }
        })
        ) {
            for (i; i < series.length; i++) {
                if (series[i].verg !== null && series[i].verg !== '') {
                    series[i].verg = null;
                    series[i].verf = null;
                    series[i].brw = (series[i].brw).toString();
                    series[i].forwarded = true;
                    break;
                }
            }
        }

        series.forEach(element => {
            if (element.verg !== null) {
                element.brw = null;
                element.verg = null;
                element.verf = null;
                element.nutzung = null;
            }
        });
        return series;
    }

    setChartOptionsSeries(series: Array<any>, label: string): void {
        this.chartOption.series.push({
            name: label,
            type: 'line',
            step: 'end',
            symbolSize: function (value) {
                if (typeof (value) === 'string') {
                    return 0;
                } else {
                    return 4;
                }
            },
            data: series.map(t => t.brw),
        });
    }

    /* eslint-disable complexity */
    setLegendFormat() {
        this.chartOption.legend.formatter = function (name) {
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
        this.chartOption.legend.textStyle.rich = {
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
        this.chartOption.grid.top = '15%';
    }

    generateSrTable(label: string, series: Array<any>): void {
        const indexes: Array<number> = [];
        for (let i = 0; i < series.length; i++) {
            if (series[i].forwarded) {
                indexes.push(i);
            }
        }
        indexes.forEach(idx => series[idx].brw = null);
        if (label) {
            this.srTableHeader.push(label);
            this.srTableData.push({ series: series });
        }
    }

    groupBy(list, keyGetter): Map<any, any> {
        const map = new Map();
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

    deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }

    onChartInit(event: any): void {
        this.echartsInstance = event;
    }

    getCurrentYear(): number {
        const today = new Date();
        return today.getFullYear();
    }

    getBremerhavenStichtag(): string {
        const year = this.getCurrentYear() - 1;
        if (year % 2 !== 0) {
            return year.toString() + '-12-31';
        } else {
            return (year-1).toString() + '-12-31';
        }
    }

    getBremenStichtag(): string {
        const year = this.getCurrentYear() - 1;
        if (year % 2 !== 0) {
            return (year-1).toString() + '-12-31';
        } else {
            return year.toString() + '-12-31';
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
