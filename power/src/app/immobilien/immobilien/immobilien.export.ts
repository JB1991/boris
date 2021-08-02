import * as ImmobilenNipixRuntime from './immobilien.runtime';
import * as ImmobilenNipixStatic from './immobilien.static';
import { ImmobilienChartOptions } from './immobilien.chartoptions';

import { ImmobilienHelper } from './immobilien.helper';

import * as echarts from 'echarts';


/**
 * Nipix Export class
 */
export class ImmobilienExport {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;
    private nipixRuntime: ImmobilenNipixRuntime.NipixRuntime;

    public exportChart = false;

    static geoJsonHeader = {
        'type': 'FeatureCollection',
        'name': 'womareg',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:EPSG::3044' } },
        'features': []
    };

    public constructor(niStatic: ImmobilenNipixStatic.NipixStatic, niRuntime: ImmobilenNipixRuntime.NipixRuntime) {
        this.nipixStatic = niStatic;
        this.nipixRuntime = niRuntime;
    }

    public exportMapAsImage() {
        const img = this.nipixRuntime.map.obj.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        ImmobilienHelper.downloadFile(img, 'Wohnungsmarktregionen.png', '', true);
    }

    /**
     * Download current Diagram Data as csv
     */
    public exportAsImage() {
        this.exportChart = true;
        this.nipixRuntime.chart.obj.resize({ width: this.nipixStatic.chartExportWidth });
        this.nipixRuntime.chart.obj.setOption(ImmobilienChartOptions.mergeHide);

    }

    private exportAsImageFinish() {

        this.exportChart = false;

        const img = this.nipixRuntime.chart.obj.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        this.nipixRuntime.chart.obj.resize({ width: 'auto' });
        this.nipixRuntime.chart.obj.setOption(ImmobilienChartOptions.mergeShow);

        ImmobilienHelper.downloadFile(img, 'nipix.png', '', true);
    }


    /*
     * Download GeoJSON fronm Map
     */
    public exportGeoJSON() {
        const data = echarts.getMap('NDS').geoJson;

        let exportFilter = [];

        if (this.nipixRuntime.state.activeSelection !== 99) { // Selected WoMa
            exportFilter = this.nipixRuntime.drawPresets[0].values;
        } else { // Meine WoMa Region
            exportFilter.push(this.nipixRuntime.state.selectedMyRegion);
        }

        for (let i = 0; i < data['features'].length; i++) {
            if (!exportFilter.includes(data['features'][i]['properties']['name'])) {
                data['features'][i] = null;
            }
        }

        data['features'] = data['features'].filter(function (el) {
            return el !== null;
        });

        ImmobilienHelper.downloadFile(JSON.stringify(data), 'Wohnungsmarktregionen.geojson');
    }

    public chartRenderFinished() {
        if (this.exportChart) {
            this.exportAsImageFinish();
        }
    }

    /**
     * Export GeoJSON with Nipix
     * @param geoJSON True for geoJSON export, otherwise CSV
     */
    public exportNiPixGeoJson(geoJSON = true) {
        if (this.nipixRuntime.chart.obj === null) {
            return;
        }
        const chartoptions = this.nipixRuntime.chart.obj.getOption();
        const date = chartoptions['xAxis'][0]['data'];
        const series = chartoptions['series'];
        const istart = Math.trunc(date.length * chartoptions['dataZoom'][0]['start'] / 100);
        const iend = Math.trunc(date.length * chartoptions['dataZoom'][0]['end'] / 100);
        let tmp = [];
        const geoData = echarts.getMap('NDS').geoJson;
        for (let d = 0; d < this.nipixRuntime.drawPresets.length; d++) {
            const drawitem = this.nipixRuntime.drawPresets[d];
            if (drawitem['show']) {
                if (geoJSON) {
                    tmp = tmp.concat(this.exportNiPixGeoJsonGeoJson(drawitem, geoData, date, series, istart, iend));
                } else {
                    tmp = tmp.concat(this.exportNiPixGeoJsonCSV(drawitem, date, series, istart, iend));
                }
            }
        }
        if (geoJSON) {
            const geoJson = JSON.parse(JSON.stringify(ImmobilienExport.geoJsonHeader));
            geoJson.features = tmp;
            ImmobilienHelper.downloadFile(JSON.stringify(geoJson), 'Immobilienpreisindex.geojson');
        } else { // CSV
            let csv = '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n';
            csv += ImmobilienHelper.convertArrayToCSV(
                tmp,
                ['type', 'region', 'nipix.date', 'nipix.index', 'nipix.sales']
            );
            ImmobilienHelper.downloadFile(csv, 'Immobilienpreisindex.csv');
        }
    }


    private exportNiPixGeoJsonGeoJson(drawitem: any, geoData: any, date, series, istart, iend) {
        const tmp = [];
        if (drawitem['type'] === 'single') {
            for (let s = 0; s < drawitem['values'].length; s++) {
                const feature = ImmobilienHelper.getSingleFeature(geoData, drawitem['values'][s]);
                if (!feature.hasOwnProperty('properties')) {
                    feature['properties'] = {};
                }
                feature['properties']['nipix'] = {
                    'type': drawitem['nipixCategory'],
                    'data': this.getNiPixTimeslot(date, series, drawitem['values'][s], istart, iend)
                };
                tmp.push(feature);
            }
        } else if (drawitem['type'] === 'aggr') {
            const feature = {
                'type': 'Feature',
                'properties': {
                    'name': drawitem['name'],
                    'nipix': {
                        'type': drawitem['nipixCategory'],
                        'data': this.getNiPixTimeslot(date, series, drawitem['name'], istart, iend)
                    }
                },
                'geometry': ImmobilienHelper.getGeometryArray(geoData, drawitem['values'])
            };
            tmp.push(feature);
        }
        return tmp;
    }


    private exportNiPixGeoJsonCSV(drawitem: any, date, series, istart, iend) {
        const tmp = [];
        if (drawitem['type'] === 'single') {
            for (let s = 0; s < drawitem['values'].length; s++) {
                const nipix = this.getNiPixTimeslot(date, series, drawitem['values'][s], istart, iend);
                if (nipix.length > 0) {
                    for (let n = 0; n < nipix.length; n++) {
                        tmp.push({
                            'type': drawitem['nipixCategory'],
                            'region': this.nipixStatic.data.regionen[drawitem['values'][s]]['name'],
                            'nipix': nipix[n]
                        });
                    }
                }
            }
        } else if (drawitem['type'] === 'aggr') {
            const nipix = this.getNiPixTimeslot(date, series, drawitem['name'], istart, iend);
            if (nipix.length > 0) {
                for (let n = 0; n < nipix.length; n++) {
                    tmp.push({
                        'type': drawitem['nipixCategory'],
                        'region': drawitem['name'],
                        'nipix': nipix[n]
                    });
                }
            }
        }
        return tmp;
    }


    /**
     * Get NiPix Data in given Timeslot
     *
     * @param date Date Array
     * @param series series array
     * @param region region to get timeslot
     * @param tstart Timeslot start date
     * @param tend Timeslot end date
     * @returns Timeslot array or empty array if region not found
     */
    private getNiPixTimeslot(date, series, region, tstart: number, tend: number) {
        let data = null;
        let datafaelle = 0;

        for (let i = 0; i < series.length; i++) {
            if (series[i]['name'] === region) {
                if (series[i]['data'].length > 0) {
                    data = series[i]['data'];
                }
            }
        }
        if (this.nipixRuntime.calculated.hiddenData.hasOwnProperty(region)) {
            datafaelle = this.nipixRuntime.calculated.hiddenData[region];
        }
        if (data !== null && datafaelle !== null) {
            const res = [];
            for (let i: number = tstart; i < tend; i++) {
                res.push({
                    'date': date[i].replace('/', '_'),
                    'index': data[i],
                    'sales': datafaelle[i]
                });
            }
            return res;
        } else {
            return [];
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
