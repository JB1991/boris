import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartOption } from 'echarts';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe]
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

    state: any;

    // screenreader
    srTableData: any = [];
    srTableHeader = [];

    seriesTemplate = [
        { stag: '2012', brw: null, nutzung: '', verf: '' },
        { stag: '2013', brw: null, nutzung: '', verf: '' },
        { stag: '2014', brw: null, nutzung: '', verf: '' },
        { stag: '2015', brw: null, nutzung: '', verf: '' },
        { stag: '2016', brw: null, nutzung: '', verf: '' },
        { stag: '2017', brw: null, nutzung: '', verf: '' },
        { stag: '2018', brw: null, nutzung: '', verf: '' },
        { stag: '2019', brw: null, nutzung: '', verf: '' },
        { stag: 'heute', brw: null, nutzung: '', verf: '' }
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
            type: 'scroll'
        },
        grid: {
            left: '3%',
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
        visualMap: {}
    };

    @Input() adresse: Feature;

    @Input() features: FeatureCollection;

    echartsInstance;

    constructor(private nutzungPipe: NutzungPipe) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.features) {
            this.clearChart();
            this.features.features = this.filterByStichtag(this.features.features);
            this.generateChart(this.features.features);
        }
    }

    clearChart() {
        this.chartOption.legend.data = [];
        this.chartOption.series = [];
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
    // tslint:disable-next-line: max-func-body-length
    generateChart(features) {
        const groupedByNutzung = this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));
        this.srTableData = [];
        this.srTableHeader = [];

        this.chartOption.visualMap = '';
        for (const [key, value] of groupedByNutzung.entries()) {
            features = Array.from(value);
            const series = this.deepCopy(this.seriesTemplate);

            // table for screenreader
            this.srTableHeader.push(key);
            let lastElement;

            for (let i = 0; i < series.length; i++) {
                const feature = features.find(f => f.properties.stag.includes(series[i].stag));
                if (feature) {
                    series[i].brw = feature.properties.brw;
                    series[i].nutzung = this.nutzungPipe.transform(feature.properties.nutzung, null);
                    series[i].verf = feature.properties.verf;
                    lastElement = i;
                }
            }
            if (lastElement < series.length - 1) {
                series[lastElement + 1].brw = (series[lastElement].brw).toString();
                series[lastElement + 1].nutzung = (series[lastElement].nutzung);
                series[lastElement + 1].verf = (series[lastElement].verf);
            }
            this.srTableData.push({ series });
            const nutzung = this.getNutzung(series);
            const color = this.setLineColor(nutzung);
            this.chartOption.legend.data.push(nutzung);
            this.chartOption.series.push({
                name: nutzung,
                type: 'line',
                step: 'end',
                data: series.map(t => t.brw),
                color: color
            });

            this.setVerfLine(series, color);
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
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

    getNutzung(series) {
        for (const entry of series) {
            if (entry.nutzung !== '') {
                return entry.nutzung;
            }
        }
        return '';
    }

    // tslint:disable-next-line: max-func-body-length
    setVerfLine(series, color) {
        const array = [];
        for (let i = 0; i < series.length; i++) {
            if (series[i].verf === 'SU' || series[i].verf === 'EU') {
                array.push(i);
            }
        }
        const r = [array[0], array[array.length - 1]];
        const seriesIndex = this.chartOption.series.length - 1;
        if (r[0] !== undefined) {
            this.chartOption.visualMap = {
                type: 'piecewise',
                show: true,
                pieces: [
                    { min: r[0], max: r[1], label: 'Sanierungsgebiet' },
                ],
                left: 'right',
                top: '5%',
                dimension: 0,
                seriesIndex: seriesIndex,
                min: r[0],
                max: r[1],
                inRange: {
                    color: ['#0080FF'],
                },
                outOfRange: {
                    color: color
                }
            };
        }
    }

    onChartInit(event: any) {
        this.echartsInstance = event;
    }

    // tslint:disable-next-line: max-func-body-length
    // tslint:disable-next-line: cyclomatic-complexity
    setLineColor(nutzung) {
        switch (nutzung) {
            case 'Allgemeines Wohngebiet': {
                return '#c4153a';
            }
            case 'Allgemeines Wohngebiet (Ein- und Zweifamilienhäuser)': {
                return 'rgba(255, 140, 0, 0.94)';
            }
            case 'Allgemeines Wohngebiet (Mehrfamilienhäuser)': {
                return 'rgba(144, 11, 245, 1)';
            }
            case 'Gewerbegebiet': {
                return 'rgba(3, 126, 71, 1)';
            }
            case 'Industriegebiet': {
                return 'rgba(11, 44, 231, 1)';
            }
            case 'Allgemeines Wohngebiet (Außenbereich)': {
                return 'rgba(11, 167, 245, 1)';
            }
            case 'Wohnbaufläche (Außenbereich)': {
                return 'rgba(59, 122, 129, 1)';
            }
            case 'Wohnbaufläche (Mehrfamilienhäuser)': {
                return 'rgba(126, 62, 3, 1)';
            }
            case 'Wohnbaufläche (Ein- und Zweifamilienhäuser)': {
                return 'rgba(101, 3, 126, 1)';
            }
            case 'Wohnbaufläche (Wohn- und Geschäftshäuser)': {
                return 'rgba(31, 91, 154, 1)';
            }
            case 'Gewerbliche Baufläche': {
                return 'rgba(208, 87, 87, 1)';
            }
            case 'Kerngebiet': {
                return 'rgba(24, 14, 88, 1)';
            }
            case 'Gewerbliche Baufläche': {
                return 'rgba(255, 214, 127, 1)';
            }
            case 'Wohnbaufläche': {
                return 'rgba(30, 148, 221, 1)';
            }
            case 'Mischgebiet': {
                return 'rgba(176, 1, 115, 1)';
            }
            default: {
                const random = Math.floor(Math.random() * ((this.seriesTemplate.length - 1) - 0 + 1));
                const color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
                return color[random];
            }
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
