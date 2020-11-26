import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { EChartOption } from 'echarts';
import { Feature, FeatureCollection } from 'geojson';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';

@Component({
    selector: 'power-bodenrichtwert-verlauf',
    templateUrl: './bodenrichtwert-verlauf.component.html',
    styleUrls: ['./bodenrichtwert-verlauf.component.scss'],
    providers: [NutzungPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
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
            type: 'scroll',
            top: '0%'
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '3%',
            top: '',
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
        visualMap: []
    };

    @Input() adresse: Feature;

    @Input() features: FeatureCollection;

    echartsInstance;

    constructor(private nutzungPipe: NutzungPipe) {
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
        const groupedByNutzung = this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));
        this.srTableData = [];
        this.srTableHeader = [];
        this.chartOption.visualMap = [];

        for (const [key, value] of groupedByNutzung.entries()) {
            features = Array.from(value);
            let series = this.deepCopy(this.seriesTemplate);

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
            this.srTableData.push({ series: series });

            series = this.fillLineDuringYear(series, lastElement);

            const nutzung = this.getNutzung(series);
            this.chartOption.legend.data.push(nutzung);
            this.setChartOptionsSeries(series, nutzung);
            this.setChartOptionsVerf(series);
        }
        this.setChartOptionsGrid();
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
        this.onResizeVerf();
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

    setChartOptionsSeries(series, nutzung) {
        this.chartOption.series.push({
            name: nutzung,
            type: 'line',
            step: 'end',
            data: series.map(t => t.brw),
        });
    }

    setChartOptionsGrid() {
        if (this.chartOption.visualMap.length === 0) {
            this.chartOption.grid.top = '10%';
        } else if (this.chartOption.visualMap.length < 3) {
            this.chartOption.grid.top = '15%';
        } else if (this.chartOption.visualMap.length < 5) {
            this.chartOption.grid.top = '22%';
        } else {
            this.chartOption.grid.top = '25%';
        }
    }

    setChartOptionsVerf(series) {
        const verfIdx = [];
        const seriesIndex = this.chartOption.series.length - 1;
        let seriesVerf = '';
        for (let i = 0; i < series.length; i++) {
            if (series[i].verf === 'SU' || series[i].verf === 'EU' || series[i].verf === 'SB' || series[i].verf === 'EB') {
                verfIdx.push(i);
                seriesVerf = series[i].verf;
            }
        }
        const r = [verfIdx[0], verfIdx[verfIdx.length - 1]];

        const [right, top, label, align] = this.setVerfLabel(seriesVerf);

        const colorInRange = this.setVerfColorInRange(seriesVerf);
        const colorOutOfRange = this.setVerfColorOutofRange();

        if (r[0] !== undefined) {
            this.chartOption.visualMap.push({
                type: 'piecewise',
                showLabel: true,
                pieces: [{
                    min: r[0],
                    max: r[1],
                    label: label
                }],
                itemWidth: 11,
                itemHeight: 11,
                align: align,
                textStyle: {
                    fontWeigth: 'lighter',
                    fontSize: 10,
                    height: '20%',
                },
                right: right,
                top: top,
                dimension: 0,
                seriesIndex: seriesIndex,
                inRange: {
                    color: colorInRange,
                },
                outOfRange: {
                    color: colorOutOfRange
                },
            });
            this.setColorSeries(series, colorOutOfRange);
        }
    }

    setVerfColorInRange(verf) {
        let color;
        if (verf === 'SU' || verf === 'EU') {
            color = '#0080FF';
        } else {
            color = '#155796';
        }
        return color;
    }

    setVerfColorOutofRange() {
        const defaultColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        const random = Math.floor(Math.random() * ((defaultColors.length - 1) - 0 + 1) + 0);
        const color = defaultColors[random];
        return color;
    }

    setColorSeries(series, color) {
        let nutzung: any;
        for (let i = 0; i < series.length; i++) {
            if (series[i].nutzung !== '') {
                nutzung = series[i].nutzung;
                break;
            }
        }
        const idx = this.chartOption.series.findIndex(el => el.name === nutzung);
        this.chartOption.series[idx].color = color;
    }

    setVerfLabel(seriesVerf) {
        const right = '10%';
        let top = '5%';
        let align = '';
        let label = '';

        if (this.chartOption.visualMap.length === 0) {
            align = 'left';
        } else if (this.chartOption.visualMap.length % 2 === 0) {
            top = 5 * this.chartOption.visualMap.length + '%';
            align = 'left';
        }

        if (this.chartOption.visualMap.length % 2 === 0) {
            if (seriesVerf === 'SU' || seriesVerf === 'EU') {
                label = 'Sanierungsgebiet:\nKeine Wertanpassung';
            } else {
                label = 'Sanierungsgebiet:\nMit Wertanpassung    ';
            }
        } else {
            if (seriesVerf === 'SU' || seriesVerf === 'EU') {
                label = 'Sanierungsgebiet:\nKeine Wertanpassung';
            } else {
                label = 'Sanierungsgebiet:\n    Mit Wertanpassung';
            }
        }
        return [right, top, label, align];
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
            series[lastElement + 1].nutzung = (series[lastElement].nutzung);
            series[lastElement + 1].verf = (series[lastElement].verf);
        }
        return series;
    }

    onResizeVerf(event?) {
        let innerWidth;
        if (event) {
            innerWidth = event.target.innerWidth;
        } else {
            innerWidth = window.innerWidth;
        }
        if (this.chartOption.visualMap.length > 1) {
            for (let i = 1; i < this.chartOption.visualMap.length; i = i + 2) {
                if (innerWidth >= 1680 || (innerWidth <= 991 && innerWidth >= 870)) {
                    this.chartOption.visualMap[i].right = '26%';
                    (i === 1) ?
                        (this.chartOption.visualMap[i].top = 5 * i + '%') :
                        (this.chartOption.visualMap[i].top = 5 * i - 1 + '%');
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if (((innerWidth < 1680 && innerWidth >= 1450) || (innerWidth < 870 && innerWidth >= 720))) {
                    this.chartOption.visualMap[i].right = '30%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 1450 && innerWidth >= 1360) || (innerWidth < 720 && innerWidth >= 650)) {
                    this.chartOption.visualMap[i].right = '32%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 1360 && innerWidth >= 1180) || (innerWidth < 650 && innerWidth >= 580)) {
                    this.chartOption.visualMap[i].right = '35%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 1180 && innerWidth >= 1080) || (innerWidth < 580 && innerWidth >= 525)) {
                    this.chartOption.visualMap[i].right = '38%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 1080 && innerWidth >= 1020) || (innerWidth < 525 && innerWidth >= 495)) {
                    this.chartOption.visualMap[i].right = '40%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 1020 && innerWidth >= 992) || (innerWidth < 495 && innerWidth >= 450)) {
                    this.chartOption.visualMap[i].right = '44%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 450 && innerWidth >= 410)) {
                    this.chartOption.visualMap[i].right = '48%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if ((innerWidth < 410 && innerWidth >= 365)) {
                    this.chartOption.visualMap[i].right = '54%';
                    i === 1 ? this.chartOption.visualMap[i].top = 5 * i + '%' : this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
                    this.chartOption.visualMap[i].align = 'right';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                } else if (innerWidth < 365) {
                    this.chartOption.visualMap[i].right = '10%';
                    this.chartOption.visualMap[i].top = 5 * this.chartOption.visualMap.length + '%';
                    this.chartOption.visualMap[i].align = 'left';
                    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
                }
            }
        }
    }

    onChartInit(event: any) {
        this.echartsInstance = event;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
