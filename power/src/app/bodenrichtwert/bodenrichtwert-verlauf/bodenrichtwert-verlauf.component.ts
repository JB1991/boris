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
                        res.push(`${params[j].marker} ${params[j].seriesName} : ${params[j].value} <br />`);
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
        let groupedByProperty = this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));
        
        for (const [key, value] of groupedByProperty.entries()) {
            for (const serie of this.seriesTemplate) {
                const values = value.filter(item => item.properties.stag.substring(0, 4) === serie.stag);
                if (values.length > 1) {
                    groupedByProperty = this.groupBy(features, item => item.properties.wnum);
                    break;
                }
            }
        }
        for (const [key, value] of groupedByProperty.entries()) {
            features = Array.from(value);
            const seriesArray = [];
            let [series, lastElement] = this.getSeriesData(features);
            series = this.fillLineDuringYear(series, lastElement);
            seriesArray.push(series);
            this.getVergSeries(series).forEach(element => {
                seriesArray.push(element);
            });
            const nutzung = this.getNutzung(key, seriesArray);
            this.chartOption.legend.data.push(nutzung);
            this.setLegendFormat(seriesArray);

            this.setChartOptionsSeries(seriesArray, nutzung);

            // table for screenreader
            this.srTableHeader.push(nutzung);
            this.srTableData.push({ series: series });
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
    }

    getSeriesData(features) {
        const series = this.deepCopy(this.seriesTemplate);
        let lastElement;
        for (let i = 0; i < series.length; i++) {
            const feature = features.find(f => f.properties.stag.includes(series[i].stag));
            if (feature) {
                series[i].brw = feature.properties.brw;
                series[i].nutzung = this.nutzungPipe.transform(feature.properties.nutzung, null);
                series[i].verg = feature.properties.verg;
                series[i].verf = feature.properties.verf;
                lastElement = i;
            }
        }
        return [series, lastElement];
    };

    getVergSeries(series) {
        const vergArray = [];
        const vergSeries = this.deepCopy(this.seriesTemplate);
        const vergList = ['San', 'Entw', 'SoSt', 'StUb'];
        const verfList = ['SU', 'EU', 'SB', 'EB'];
        const proofVerfSeries = series.find(element => element.verf === 'SU' || element.verf === 'EU' || element.verf === 'SB' || element.verf === 'EB');
        vergList.forEach(verg => {
            if (proofVerfSeries) {
                verfList.forEach(verf => {
                    for (let i = 0; i < series.length; i++) {
                        if (series[i].verg === verg && series[i].verf && series[i].verf === verf) {
                            vergSeries[i].brw = series[i].brw;
                            vergSeries[i].nutzung = series[i].nutzung;
                            vergSeries[i].verg = series[i].verg;
                            vergSeries[i].verf = series[i].verf;
                        }
                    }
                    const proofThisVerfSeries = vergSeries.find(element => element.verf === verf);
                    const proofVergSeries = vergSeries.find(element => element.verg === verg);
                    if (proofVergSeries && proofThisVerfSeries) {
                        vergArray.push(vergSeries);
                    }
                });
            } else {
                for (let i = 0; i < series.length; i++) {
                    if (series[i].verg === verg) {
                        vergSeries[i].brw = series[i].brw;
                        vergSeries[i].nutzung = series[i].nutzung;
                        vergSeries[i].verg = series[i].verg;
                        vergSeries[i].verf = series[i].verf;
                    }
                }
                const proofVergSeries = vergSeries.find(element => element.verg === verg);
                if (proofVergSeries) {
                    vergArray.push(vergSeries);
                }
            }
        });
        return vergArray;
    }
   
    getNutzung(key, series) {
        console.log(series);
        let nutzung;
        const wnum = Number(key);
        for (const entry of series[0]) {
            if (entry.nutzung !== '') {
                nutzung = entry.nutzung;
            }
        }
        if (series.length > 1) {
            for (const entry of series[0]) {
                if (entry.nutzung !== '') {
                    let verg = series[0].find(el => el.verg !== '' && el.verg !== null )
                    verg = this.verfahrensartPipe.transform(verg.verg, null);
                    console.log(verg);
                    nutzung += '\n' + verg;
                    return nutzung;
                }
            }
            return '';
        } else if (wnum) {
            for (const entry of series[0]) {
                if (entry.nutzung !== '') {
                    nutzung += '\n' + wnum;
                    return nutzung;
                }
            }
            return '';
        } 
        return nutzung;
    }

    fillLineDuringYear(series, lastElement) {
        // check gap in graph
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
                }
            } while (series[j].brw === null && j < (series.length - 1));
        } while (typeof (series[i + 1].brw) !== 'string' && i < (series.length - 3));
        // input for seriesElement 'today'
        if (lastElement < series.length - 1) {
            series[lastElement + 1].brw = (series[lastElement].brw).toString();
            series[lastElement + 1].nutzung = series[lastElement].nutzung;
            series[lastElement + 1].verg = series[lastElement].verg;
            series[lastElement + 1].verf = series[lastElement].verf;
        }
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

    setLegendFormat (seriesArray) {
        if (seriesArray.length > 1) {
            this.chartOption.legend.formatter = function (name) {
                const splittedName = name.split('\n')
                let text;
                if (splittedName[1] === 'Sanierungsgebiet' || splittedName[1] === 'Entwicklungsbereich' || splittedName[1] === 'Soziale Stadt' || splittedName[1] === 'Stadtumbau') {
                    return [`{nutzung|${splittedName[0]}}`,`{hr|  }`,[`{series|  }`,`{verg|${splittedName[1]}}`].join('')].join('\n');
                }
                console.log(text);
                return name;
            }
            this.chartOption.legend.textStyle.rich = {
                'nutzung': {
                    padding: [5,0,10,0]
                },
                'verg': {
                    fontSize: 10,
                    padding: [0, 0, 5, 5]
                },
                'icon': {
                    // heigth: '10%',
                    // width: '10%',
                    // backgroundColor: '#0080FF'
                },
                'hr': {
                    borderColor: '#777',
                    width: '40%',
                    borderWidth: 0.2,
                    height: 0,
                    padding: [0,0,0,0]
                },
                'series': {
                    borderColor: '#0080FF',
                    width: 8,
                    borderWidth: 0.5,
                    height: 0,
                    padding: [0,0,0,0]
                }
            }
            this.chartOption.grid.top = '15%';
        }
    }
    

    setSeriesColor(series) {
        let color;
        const verf = series.find(element => element.verf === 'SU' || element.verf === 'EU' || element.verf === 'SB' || element.verf === 'EB');
        if (verf.verf === 'SU' || verf.verf === 'EU') {
            color = '#0080FF';
            return color;
        } else {
            color = '#155796';
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
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
