/* eslint-disable max-lines */
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
        this.srTableData = [];
        this.srTableHeader = [];
        this.chartOption.visualMap = [];
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
            this.setChartOptionsSeries(seriesArray, nutzung);
            // this.setChartOptionsVerf(series);

            // table for screenreader
            this.srTableHeader.push(series.nutzung);
            this.srTableData.push({ series: series });
        }
        // this.setChartOptionsGrid();
        this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
        // this.onResizeVerf();
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

    getNutzung(key, series) {
        const wnum = Number(key);
        console.log(series);
        if (series.length > 1) {
            for (const entry of series[0]) {
                if (entry.nutzung !== '') {
                    return entry.nutzung + '\n' + 'Sanierungsgebiet';
                }
            }
            return '';
        }else if (wnum) {
            for (const entry of series[0]) {
                if (entry.nutzung !== '') {
                    return entry.nutzung + '\n' + wnum;
                }
            }
            return '';
        } else {
            for (const entry of series[0]) {
                if (entry.nutzung !== '') {
                    return entry.nutzung;
                }
            }
            return '';
        }
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

    setSeriesColor(series) {
        // const proofSeries = series.find(element => element.verg === 'San' || 'Entw' || 'SoSt' || 'StUb');
        // if (proofSeries) {
        let color;
        const verf = series.find(element => element.verf === 'SU' || element.verf === 'EU' || element.verf === 'SB' || element.verf === 'EB');
        if (verf.verf === 'SU' || verf.verf === 'EU') {
            color = '#0080FF';
            return color;
        } else {
            color = '#155796';
            return color;
        }

        // }
        // const defaultColors =
        // ['#c4153a', '#2f4554', '#61a0a8', '#d48265', '#5c2b82',
        // '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        // const seriesLength = this.chartOption.series.length;
        // let random;

        // if (!seriesLength) {
        //     random = Math.floor(Math.random() * ((defaultColors.length - 1) - 0 + 1) + 0);
        // } else {
        //     const idx = defaultColors.findIndex(
        //         color => color === this.chartOption.series[seriesLength - 1].color
        //     );
        //     if (idx > (defaultColors.length - 3)) {
        //         random = 0;
        //     } else {
        //         random = idx + 2;
        //     }
        // }
        // return defaultColors[random];
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

    // Following methods are used for the "Verfahrensgrund" respectivly "Entwicklungszusatz"



    // setChartOptionsGrid() {
    //     if (this.chartOption.visualMap.length === 0) {
    //         this.chartOption.grid.top = '10%';
    //     } else if (this.chartOption.visualMap.length < 3) {
    //         this.chartOption.grid.top = '15%';
    //     } else if (this.chartOption.visualMap.length < 5) {
    //         this.chartOption.grid.top = '22%';
    //     } else {
    //         this.chartOption.grid.top = '25%';
    //     }
    // }

    // setChartOptionsVerf(series) {
    //     const verfIdx = [];
    //     const seriesIndex = this.chartOption.series.length - 1;
    //     let seriesVerf = '';
    //     for (let i = 0; i < series.length; i++) {
    //         if (series[i].verf === 'SU' || series[i].verf === 'EU' ||
    // series[i].verf === 'SB' || series[i].verf === 'EB') {
    //             verfIdx.push(i);
    //             seriesVerf = series[i].verf;
    //         }
    //     }
    //     const r = [verfIdx[0], verfIdx[verfIdx.length - 1]];

    //     if (r[0] !== undefined) {
    //         const [right, top, label, align] = this.setVerfLabel(seriesVerf);
    //         const colorInRange = this.setVerfColorInRange(seriesVerf);
    //         const colorOutOfRange = this.getSeriesColor(series);

    //         this.chartOption.visualMap.push({
    //             type: 'piecewise',
    //             showLabel: true,
    //             pieces: [{
    //                 min: r[0],
    //                 max: r[1],
    //                 label: label
    //             }],
    //             itemWidth: 11,
    //             itemHeight: 11,
    //             align: align,
    //             textStyle: {
    //                 fontWeigth: 'lighter',
    //                 fontSize: 10,
    //                 height: '20%',
    //             },
    //             right: right,
    //             top: top,
    //             dimension: 0,
    //             seriesIndex: seriesIndex,
    //             inRange: {
    //                 color: colorInRange,
    //             },
    //             outOfRange: {
    //                 color: colorOutOfRange
    //             },
    //         });
    //     }
    // }

    // setVerfColorInRange(verf) {
    //     let color;
    //     if (verf === 'SU' || verf === 'EU') {
    //         color = '#0080FF';
    //     } else {
    //         color = '#155796';
    //     }
    //     return color;
    // }


    // setVerfLabel(seriesVerf) {
    //     const right = '10%';
    //     let top = '5%';
    //     let align = '';
    //     let label = '';

    //     if (this.chartOption.visualMap.length === 0) {
    //         align = 'left';
    //     } else if (this.chartOption.visualMap.length % 2 === 0) {
    //         top = 5 * this.chartOption.visualMap.length + '%';
    //         align = 'left';
    //     }

    //     if (seriesVerf === 'SU' || seriesVerf === 'EU') {
    //         label = 'Sanierungsgebiet:\nOhne Wertanpassung';
    //     } else {
    //         label = 'Sanierungsgebiet:\nMit Wertanpassung    ';
    //     }
    //     return [right, top, label, align];
    // }

    // onResizeVerf(event?) {
    //     let innerWidth;
    //     if (event) {
    //         innerWidth = event.target.innerWidth;
    //     } else {
    //         innerWidth = window.innerWidth;
    //     }
    //     // Formula calculated using trendline (polynomial 3rd degree - excel)
    //     const functionTerms = [];
    //     functionTerms[0] = (Math.pow(10, -8) * -8.942807851916) * Math.pow(innerWidth, 3);
    //     functionTerms[1] = 0.000293202314619 * Math.pow(innerWidth, 2);
    //     functionTerms[2] = 0.304956384617639 * innerWidth;
    //     const res = functionTerms[0] + functionTerms[1] - functionTerms[2] + 134.2489932868;

    //     for (let i = 1; i < this.chartOption.visualMap.length; i = i + 2) {
    //         if (i === 1) {
    //             this.chartOption.visualMap[i].top = 5 * i + '%';
    //         } else {
    //             this.chartOption.visualMap[i].top = 5 * i - 1 + '%';
    //         }
    //         if (innerWidth >= 1620) {
    //             this.chartOption.visualMap[i].right = '26%';
    //         } else if (innerWidth < 1160 && innerWidth >= 992) {
    //             this.chartOption.visualMap[i].right = '42%';
    //         } else if (innerWidth < 380) {
    //             this.chartOption.visualMap[i].right = '10%';
    //             this.chartOption.visualMap[i].top = 5 * this.chartOption.visualMap.length + '%';
    //         } else {
    //             this.chartOption.visualMap[i].right = res + '%';
    //         }
    //         this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true);
    //     }
    // }

    onChartInit(event: any) {
        this.echartsInstance = event;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
