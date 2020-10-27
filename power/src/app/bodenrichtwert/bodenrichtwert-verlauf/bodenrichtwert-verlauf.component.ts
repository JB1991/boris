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

    seriesTemplate = [
        {stag: '2012', brw: null, nutzung: ''},
        {stag: '2013', brw: null, nutzung: ''},
        {stag: '2014', brw: null, nutzung: ''},
        {stag: '2015', brw: null, nutzung: ''},
        {stag: '2016', brw: null, nutzung: ''},
        {stag: '2017', brw: null, nutzung: ''},
        {stag: '2018', brw: null, nutzung: ''},
        {stag: '2019', brw: null, nutzung: ''},
    ];

    public chartOption: EChartOption = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            }
        },
        legend: {
            data: []
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
            }
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
        series: []
    };

    @Input() adresse: Feature;

    @Input() features: FeatureCollection;


    echartsInstance;

    constructor(
        private nutzungPipe: NutzungPipe
    ) {

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

    generateChart(features) {
        const groupedByNutzung = this.groupBy(features, item => this.nutzungPipe.transform(item.properties.nutzung));

        for (const [key, value] of groupedByNutzung.entries()) {
            features = Array.from(value);
            const series = this.deepCopy(this.seriesTemplate);

            for (let i = 0; i < series.length; i++) {
                const feature = features.find(f => f.properties.stag.includes(series[i].stag));
                if (feature) {
                    series[i].brw = feature.properties.brw;
                    series[i].nutzung = this.nutzungPipe.transform(feature.properties.nutzung, null);
                }
            }

            const nutzung = this.getNutzung(series);
            this.chartOption.legend.data.push(nutzung);
            this.chartOption.series.push({
                name: nutzung,
                type: 'line',
                step: 'end',
                data: series.map(t => t.brw)
            });
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

    onChartInit(event: any) {
        this.echartsInstance = event;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
