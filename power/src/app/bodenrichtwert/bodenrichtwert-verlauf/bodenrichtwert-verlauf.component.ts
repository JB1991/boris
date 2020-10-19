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
        {stag: '2012', brw: 0, nutzung: ''},
        {stag: '2013', brw: 0, nutzung: ''},
        {stag: '2014', brw: 0, nutzung: ''},
        {stag: '2015', brw: 0, nutzung: ''},
        {stag: '2016', brw: 0, nutzung: ''},
        {stag: '2017', brw: 0, nutzung: ''},
        {stag: '2018', brw: 0, nutzung: ''},
        {stag: '2019', brw: 0, nutzung: ''},
    ];

    chartOption: EChartOption = {
        tooltip: {
            trigger: 'axis'
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
            nameLocation: 'start'
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} €/m²'
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
            this.features.features = this.filterByStichtag(this.features.features);
            this.generateChart(this.features.features);
        }
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
        const groupedByWNUM = this.groupBy(features, item => item.properties.wnum);

        this.chartOption.series = [];

        for (const [key, value] of groupedByWNUM.entries()) {

            features = Array.from(value);

            const series = this.seriesTemplate;

            for (let i = 0; i < series.length; i++) {
                const tmp = features.find(f => f.properties.stag.includes(series[i].stag));
                if (tmp) {
                    series[i].brw = tmp.properties.brw;
                    series[i].nutzung = this.nutzungPipe.transform(tmp.properties.nutzung, null);
                }
            }
            this.chartOption.legend.data.push(series[0].nutzung);
            this.chartOption.series.push({
                name: series[0].nutzung,
                type: 'line',
                step: 'end',
                data: series.map(t => t.brw)
            }
            );
        }
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true, true);
    }

    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    onChartInit(event: any) {
        this.echartsInstance = event;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
