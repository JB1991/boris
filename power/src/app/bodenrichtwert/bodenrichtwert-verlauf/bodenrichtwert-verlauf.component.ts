/* eslint-disable max-lines */
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { EChartOption } from 'echarts';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { VerfahrensartPipe } from '@app/bodenrichtwert/pipes/verfahrensart.pipe';

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe, VerfahrensartPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

    state: any;

    // screenreader
    srTableData: any = [];
    srTableHeader = [];

    seriesTemplate = [
        { stag: '2012', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2013', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2014', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2015', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2016', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2017', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2018', brw: null, nutzung: '', verg: '', verf: '' },
        { stag: '2019', brw: null, nutzung: '', verg: '', verf: '' },
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
                    if (params[j].value !== undefined && typeof (params[j].value) !== 'string' && params[j].color !== '#0080FF' && params[j].color !== '#155796') {
                        const splittedName = params[j].seriesName.split('\n');
                        res.push(`${params[j].marker} ${splittedName[0]} : ${params[j].value} <br />`);
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
            data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
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

    constructor(private nutzungPipe: NutzungPipe, private verfahrensartPipe: VerfahrensartPipe) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.features) {
            if (this.features) {
                this.clearChart();
                this.features.features = this.filterByStichtag(this.features.features);
                this.generateChart(this.features.features);
            }
        }
    }

    clearChart() {
        this.chartOption.legend.data = [];
        this.chartOption.series = [];
        this.srTableData = [];
        this.srTableHeader = [];
        this.chartOption.legend.formatter = '';
        this.chartOption.legend.textStyle.rich = '';
        this.chartOption.grid.top = '10%';
    }

    filterByStichtag(features) {
        const filteredFeatures = [];
        for (const feature of features) {
            const year = feature.properties.stag.substring(0, 4);
            if (year >= 2012 && year <= 2019) {
                filteredFeatures.push(feature);
            }
        }
        return filteredFeatures;
    }

    generateChart(features) {
        // grouped by Nutzungsart
        let groupedByProperty = this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));
        for (const [key, value] of groupedByProperty.entries()) {
            for (const seriesTuple of this.seriesTemplate) {
                const values = value.filter(item => item.properties.stag.substring(0, 4) === seriesTuple.stag);
                if (values.length > 1) {
                    // grouped by Bodenrichtwertnummer
                    groupedByProperty = this.groupBy(features, item => item.properties.wnum);
                    break;
                }
            }
        }
        for (const [key, value] of groupedByProperty.entries()) {
            const seriesArray = [];
            features = Array.from(value);

            seriesArray[0] = this.getSeriesData(features);
            seriesArray[0] = this.fillLineDuringYear(seriesArray[0]);
            this.getVergSeries(seriesArray[0]).forEach(element => {
                seriesArray.push(element);
            });

            const label = this.getLabel(key, seriesArray);

            this.chartOption.legend.data.push(label);
            this.setLegendFormat(seriesArray);
            this.setChartOptionsSeries(seriesArray, label);

            this.generateSrTable(label, seriesArray);
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
    }

    getSeriesData(features) {
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

    getVergSeries(series) {
        const seriesVergValuesTotal = [];
        const seriesVergValues = this.deepCopy(this.seriesTemplate);
        const defaultVerg = ['San', 'Entw', 'SoSt', 'StUb'];
        const defaultVerf = ['SU', 'EU', 'SB', 'EB'];
        const seriesIncludesVerf = series.find(element => element.verf === 'SU' || element.verf === 'EU' || element.verf === 'SB' || element.verf === 'EB');
        const copyData = function (i) {
            seriesVergValues[i].brw = series[i].brw;
            seriesVergValues[i].nutzung = series[i].nutzung;
            seriesVergValues[i].verg = series[i].verg;
            seriesVergValues[i].verf = series[i].verf;
        };
        defaultVerg.forEach(verg => {
            if (seriesIncludesVerf) {
                defaultVerf.forEach(verf => {
                    for (let i = 0; i < series.length; i++) {
                        if (series[i].verg === verg && series[i].verf === verf) {
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

    getLabel(key, seriesArray) {
        let nutzung = (seriesArray[0].find(seriesItem => seriesItem.nutzung !== '')).nutzung;
        const wnum = Number(key);
        if (wnum) {
            nutzung += '\n' + wnum;
        }
        if (seriesArray.length > 1) {
            for (const entry of seriesArray[0]) {
                if (entry.nutzung !== '') {
                    let verg = seriesArray[0].find(el => el.verg !== '' && el.verg !== null);
                    let verf = [];
                    seriesArray[0].filter(el => {
                        if (el.verf !== '' && el.verf !== null) {
                            verf.push(el.verf);
                        }
                    });
                    verf = verf.filter((el, idx, self) => idx === self.indexOf(el));
                    verg = this.verfahrensartPipe.transform(verg.verg, null);
                    nutzung += '\n' + verg;
                    if (verf) {
                        verf.forEach(verfItem => {
                            if (verfItem === 'SB' || verfItem === 'EB') {
                                nutzung += '\n' + 'Mit Wertanpassung';
                            } else {
                                nutzung += '\n' + 'Ohne Wertanpassung';
                            }
                        });
                    }
                    return nutzung;
                }
            }
        }
        return nutzung;
    }

    fillLineDuringYear(series) {
        // check gap in same series
        let i = -1;
        do {
            i++;
            let j = i + 1;
            do {
                j++;
                // fill graph
                if (series[i].brw !== null && series[i + 1].brw === null && series[j].brw !== null) {
                    series[i + 1].brw = (series[i].brw).toString();
                    series[i + 1].nutzung = series[i].nutzung;
                    series[i + 1].verf = series[i].verf;
                    series[i + 1].forwarded = true;
                }
            } while (series[j].brw === null && j < (series.length - 1));
        } while (typeof (series[i + 1].brw) !== 'string' && i < (series.length - 3));

        let seriesValues = series.filter(element => element.brw);
        seriesValues = seriesValues[seriesValues.length - 1].stag;
        const idx = series.findIndex(element => element.stag === seriesValues);
        series[idx + 1].brw = (series[idx].brw).toString();
        series[idx + 1].nutzung = series[idx].nutzung;
        series[idx + 1].verg = series[idx].verg;
        series[idx + 1].verf = series[idx].verf;
        series[idx + 1].forwarded = true;

        return series;
    }

    setChartOptionsSeries(series, nutzung) {
        series.forEach((serie, index) => {
            let seriesColor;
            if (index) {
                seriesColor = this.setSeriesColor(serie);
            }
            this.chartOption.series.push({
                name: nutzung,
                type: 'line',
                step: 'end',
                color: seriesColor,
                data: serie.map(t => t.brw),
            });
        });
    }

    /* eslint-disable complexity */
    setLegendFormat(seriesArray) {
        if (seriesArray.length > 1) {
            this.chartOption.legend.formatter = function (name) {
                const splittedName = name.split('\n');
                const verg = splittedName.find(item => item === 'Sanierungsgebiet' || item === 'Entwicklungsbereich' || item === 'Soziale Stadt' || item === 'Stadtumbau');
                const verf = splittedName.find(item => item === 'Mit Wertanpassung' || item === 'Ohne Wertanpassung');
                const wnum = splittedName.find(item => Number(item));
                if (verf && wnum) {
                    switch (verf) {
                        case ('Mit Wertanpassung'): {
                            return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`, '{hr|  }', ['{seriesSbEb|  }', [`{verg|${verg}}`, `{verf|(${verf})}`].join('\n')].join('')].join('\n');
                        }
                        case ('Ohne Wertanpassung'): {
                            return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`, '{hr|  }', ['{series|  }', [`{verg|${verg}}`, `{verf|(${verf})}`].join('\n')].join('')].join('\n');
                        }
                    }
                }
                if (verf && verf !== '') {
                    switch (verf) {
                        case ('Mit Wertanpassung'): {
                            return [`{nutzung|${splittedName[0]}}`, '{hr|  }', ['{seriesSbEb|  }', [`{verg|${verg}}`, `{verf|(${verf})}`].join('\n')].join('')].join('\n');
                        }
                        case ('Ohne Wertanpassung'): {
                            return [`{nutzung|${splittedName[0]}}`, '{hr|  }', ['{series|  }', [`{verg|${verg}}`, `{verf|(${verf})}`].join('\n')].join('')].join('\n');
                        }
                    }
                }
                if (wnum && (verg === 'Sanierungsgebiet' || verg === 'Entwicklungsbereich' || verg === 'Soziale Stadt' || verg === 'Stadtumbau')) {
                    return [`{nutzung|${splittedName[0]}}`, `{wnum|${wnum}}`, '{hr|  }', ['{series|  }', `{verg|${verg}}`].join('')].join('\n');
                }
                if (verg === 'Sanierungsgebiet' || verg === 'Entwicklungsbereich' || verg === 'Soziale Stadt' || verg === 'Stadtumbau') {
                    return [`{nutzung|${splittedName[0]}}`, '{hr|  }', ['{series|  }', `{verg|${verg}}`].join('')].join('\n');
                }
                return name;
            };
            this.chartOption.legend.textStyle.rich = {
                'nutzung': {
                    padding: [5, 0, 10, 0]
                },
                'verg': {
                    fontSize: 10,
                    padding: [0, 0, 5, 5]
                },
                'verf': {
                    fontSize: 9,
                    padding: [0, 0, 5, 5]
                },
                'wnum': {
                    fontSize: 10
                },
                'hr': {
                    borderColor: '#777',
                    width: '40%',
                    borderWidth: 0.2,
                    height: 0,
                    padding: [0, 0, 0, 0]
                },
                'seriesSbEb': {
                    borderColor: '#155796',
                    width: 8,
                    borderWidth: 2.5,
                    height: 0,
                    padding: [0, 0, 0, 0]
                },
                'series': {
                    borderColor: '#0080FF',
                    width: 8,
                    borderWidth: 2.5,
                    height: 0,
                    padding: [0, 0, 0, 0]
                }
            };
            this.chartOption.grid.top = '17%';
        }
    }

    setSeriesColor(series) {
        let color;
        const verf = series.find(element => element.verf === 'SU' || element.verf === 'EU' || element.verf === 'SB' || element.verf === 'EB');
        if (verf && (verf.verf === 'SB' || verf.verf === 'EB')) {
            color = '#155796';
            return color;
        } else {
            color = '#0080FF';
            return color;
        }
    }

    getSeriesColor(series) {
        let nutzung: any;
        for (let i = 0; i < series.length; i++) {
            if (series[i].nutzung !== '') {
                nutzung = series[i].nutzung;
                break;
            }
        }
        const idx = this.chartOption.series.findIndex(el => el.name === nutzung);
        return this.chartOption.series[idx].color;
    }

    generateSrTable(label, series: Array<any>) {
        const indexes = [];
        for (let i = 0; i < series[0].length; i++) {
            if (series[0][i].forwarded) {
                indexes.push(i);
            }
        }
        indexes.forEach(idx => series[0][idx].brw = null);
        this.srTableHeader.push(label);
        this.srTableData.push({ series: series[0] });
    }

    groupBy(list, keyGetter) {
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

    onChartInit(event: any) {
        this.echartsInstance = event;
    }

    getBremenStichtag() {
        const today = new Date();
        const year = today.getFullYear() - 1;
        if (year % 2 !== 0) {
            return ('31.' + '12.' + (year - 2) + '.');
        } else {
            return ('31.' + '12.' + (year - 1) + '.');
        }
    }

    getBremerhavenStichtag() {
        const today = new Date();
        const year = today.getFullYear() - 1;
        if (year % 2 === 0) {
            return ('31.' + '12.' + (year - 2) + '.');
        } else {
            return ('31.' + '12.' + (year - 1) + '.');
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
