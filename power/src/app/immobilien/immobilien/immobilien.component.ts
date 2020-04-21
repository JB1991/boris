import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgbAccordion, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';


import * as echarts from 'echarts';

import {
    convertArrayToCSV,
    convertColor,
    downloadFile,
    generateDrawSeriesData,
    generateSeries,
    getDate,
    getGeometryArray,
    getMyMapRegionen,
    getNiPixTimeslot,
    getSingleFeature,
    modifyRegionen
} from './immobilien.functions.js';

declare const require: any;

@Component({
    selector: 'power-immobilien',
    templateUrl: './immobilien.component.html',
    styleUrls: ['./immobilien.component.scss']
})
export class ImmobilienComponent implements OnInit {

    /**
     * Constructor
     *
     * @param http Inject HttpClient
     */
    constructor(
        private http: HttpClient
    ) {
    }

    @ViewChild('acc', {static: true}) accordionComponent: NgbAccordion;
    model: any;

    gemeinden = {};

    @ViewChild('instance', {static: true}) instance: NgbTypeahead;

    title = 'lgln';

    // Layout RTL
    layoutRtl = false;

    // Config URl
    configUrl = 'assets/data/cfg.json';

    // ABGN Url
    agnbUrl = '';

    // Icon array
    iconFor = {
        'gebrauchte Eigenheime': 'fa-home',
        'gebrauchte Eigentumswohnungen': 'fa-hospital-o',
    };

    // show loading spinner:
    mapLoaded = false;

    // empty option before geoJSON loaded:
    options = {};

    // Map/Chart object
    map = null;
    chart = null;

    // Regionen
    myRegionen = [];

    // AllRegions
    allItems = [];

    // ShortNames
    shortNames = {};

    // Map Coord
    geoCoordMap = [];

    // Tmp
    currentRate = 0;

    // NiPix Category
    nicat = [];

    // reference Date
    referenceDate = '2016_1';

    // selected_Chart_Line
    selectedChartLine = '';

    // range
    rangeStartIndex = 0;
    rangeEndIndex = 0;

    // Map Regionen
    mapRegionen = [];

    // Draw array
    draw = [];

    // Drawdata
    drawdata = [];

    // Hiddendata
    hiddendata = {};

    // Seclections
    selection = [];

    // Active Selection
    activeSelection = 0;

    // ChartTitle
    chartTitle = '';

    // Line-Legend
    legendposition = [];

    // Date array
    date = [];

    // Nipix data
    nipix = {};

    chartOptionMerge = {};

    selectedMyRegion = '';

    // Highlight Series while MouseOver
    highlightedSeries = '';
    highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);

    // Find My WomaReg
    focus$ = new Subject<string>();
    click$ = new Subject<string>();


    /**
     * echart_range_series
     */
    chart_range = {
        id: 'a',
        type: 'line',
        z: 0,
        xAxisIndex: 1,
        yAxisIndex: 1,
        silent: true,
        animation: false,
        areaStyle: {
            color: '#ccc'
        },
        itemStyle: {
            color: '#ccc'
        },
        smooth: false,
        symbol: 'none',
        data: [[0, 0], [0, -0.2], [50, -1], [100, -1], [100, -0.2], [100, 0]]
    };

    /**
     * Configuration Option for the Chart
     */
    chartOption: echarts.EChartOption = {
        'title': <any>{
            'text': 'Niedersächsischer Immobilienpreisindex (NIPIX)',
            'left': 'center',
            'top': 10
        },
        grid: [
            {
                top: 130,
                left: '60',
                right: '90',
                bottom: 75,
                'backgroundColor': 'rgb(255, 255, 255)',
                'borderColor': 'transparent',
                'show': true
            },
            {
                left: '60',
                right: '90',
                height: '30',
                bottom: '50'
            }
        ],
        graphic: [
            {
                type: 'text',
                id: 'copyright',
                right: 90,
                bottom: 10,
                z: 100,
                style: {
                    fill: '#333',
                    textAlign: 'right',
                    text: '© Oberer Gutachterausschusses für Grundstückswerte in Niedersachsen, '+getDate()
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: this.date,
                axisLine: {onZero: false},
                splitLine: {show: false},
                axisLabel: {show: true},
                name: 'Zeit'
            },
            {
                id: 'xds',
                type: 'value',
                gridIndex: 1,
                boundaryGap: false,
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false},
                min: 0,
                max: 100,
                silent: true
            }

        ],
        yAxis: [
            {
                type: 'value',
                boundaryGap: ['10%', '20%'],
                scale: true,
                axisLabel: {show: true},
                name: 'Preisentwicklung',
                nameLocation: 'middle',
                nameRotate: 90,
                nameGap: 35
            },
            {
                id: 'yds',
                scale: false,
                gridIndex: 1,
                splitNumber: 2,
                type: 'value',
                min: -1,
                max: 0,
                silent: true,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            <any>{
                type: 'slider',
                xAxisIndex: [0],
                realtime: false,
                start: 80,
                end: 100,
                bottom: 30,
                height: 20,
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '120%'
            }, <any>{
                type: 'inside',
                xAxisIndex: [0],
                start: 80,
                end: 100,
                top: 30,
                height: 20
            }
        ],
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            formatter: function (params, ticket, callback) {

                let faelle = 0;

                if (this.hiddendata.hasOwnProperty(params.seriesName)) {
                    faelle = this.hiddendata[params.seriesName][params.dataIndex];
                }

                let printName = params.seriesName;
                if (this.myRegionen.hasOwnProperty(params.seriesName)) {
                    printName = this.myRegionen[params.seriesName]['name'];
                }

                let entw = (Math.round((params.data - 100) * 10) / 10);
                if (entw > 0) {
                    entw = <any>('+' + entw);
                }

                this.highlightSeries(params.seriesName);

                return '<b>' + (<any>params).marker + printName + '</b><br>' +
                    'Preisentwicklung seit ' + this.referenceDate.replace('_', '/') + ': ' + entw + '%<br>' +
                    'Zugrunde liegende Fälle (' + params.name + '): ' + faelle;
            }.bind(this)
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            itemSize: 30,
            itemGap: 20,
            right: 5,
            top: 190,
            feature: {
                mySaveAsImage: {
                    show: true,
                    title: 'Bild',
                    icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z',
                    onclick: this.exportAsImage.bind(this)
                },
                mySaveAsCSV: {
                    show: true,
                    title: 'CSV',
                    icon: 'path://M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M10,19H7V17H10V19M10,16H7V14H10V16M10,13H7V11H10V13M14,19H11V17H14V19M14,16H11V14H14V16M14,13H11V11H14V13M13,9V3.5L18.5,9H13Z',
                    onclick: this.exportCSV.bind(this)
                },
                mySaveAsGeoJSON: {
                    show: true,
                    title: 'GeoJSON',
                    icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z',
                    onclick: this.exportNiPixGeoJson.bind(this)
                }

            }
        },
        series: [
            this.chart_range
        ],
    };

    // Find My WomaReg
    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;

        const gem = this.gemeinden;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map(term => (term === '' ? Object.keys(gem)
                : Object.keys(gem).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
    }

    fillDateArray(lastYear, lastPeriod) {
        // Generate the date array
        const now = new Date();

        for (let i = 2000; i < lastYear + 1; i++) {
            for (let q = 1; q < 5; q++) {
                if ((!(i <= 2000 && q == 1)) && (!((i == lastYear) && (q > lastPeriod)))) {
                    this.date.push(i + '/' + q);
                }
            }

        }
    }


    /**
     * Init the Application.
     * Load external Config File
     */
    ngOnInit() {
        // LoadConfig
        this.loadConfig(this.configUrl);
    }

    /**
     * Handle Load Configuration
     *
     * Format: JSON
     *
     * @param {string} url Url to Configuration
     */
    loadConfig(url) {

        this.http.get(url)
            .subscribe(json => {

                // Layout
                this.layoutRtl = json['layoutRtl'];

                // ABGN
                this.agnbUrl = json['agnbUrl'];

                // Geo Choord
                this.geoCoordMap = json['map']['geoCoordMap'];

                // Regionen
                this.myRegionen = json['regionen'];

                // Draw-Presets
                this.draw = json['presets'];

                // Map-Regionen
                this.mapRegionen = getMyMapRegionen(this.myRegionen, null, null, true);

                this.allItems = json['items'];
                this.shortNames = json['shortNames'];

                // Selections
                this.selection = json['selections'];

                // ChartTitle
                this.chartTitle = this.selection[0]['name'];

                // LoadData
                this.fillDateArray(json['lastYear'], json['lastPeriod']);

                // Load Gemeinden
                this.loadGemeinden(json['gemeindenUrl']);

                // Laod Map from asset
                this.loadGeoMap(json['mapUrl']);

                // Load NiPix from asset
                this.loadNiPix(json['nipixUrl']);

            });
    }

    /**
     * Handle Load Gemeinden
     *
     * Format CSV; Seperator: Semikolon;
     * Fields: AGS, Geme_Bezeichnung, WOMA_ID
     *
     * @params {string} url Url to Gemeinnde CSV
     */
    loadGemeinden(url) {
        // Load nipix
        this.http.get(url, {responseType: 'text'})
            .subscribe(gem => {
                const rgn = {};
                const lines = gem.split(/\r\n|\r|\n/g);

                // Iterate over all lines
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].split(';');

                    // If line is valid
                    if (line[0].length == 7) {

                        rgn[line[1]] = line[2];
                    }
                }

                this.gemeinden = rgn;
            });
    }

    /**
     * Load Map
     *
     * @param {string} url Url to Map GeoJSON
     */
    loadGeoMap(url) {

        // fetch map geo JSON data from server
        this.http.get(url)
            .subscribe(
                geoJson => {
                    // hide loading:
                    this.mapLoaded = true;

                    // register map:
                    echarts.registerMap('NDS', geoJson);

                    this.setMapOptions();
                });
    }

    /**
     * Handle Load NiPix
     *
     * Format: CSV; Seperator: Semikolon;
     * Fields: Immobilienart, Region(ID), Zeitabschnitt (YYYY_Q), Anzahl, Index
     *
     * @param {string} url Url to Nipix CSV
     */
    loadNiPix(url) {

        // Load nipix
        this.http.get(url, {responseType: 'text'})
            .subscribe(nipix => {

                const npx = {};
                const lines = nipix.split(/\r\n|\r|\n/g);

                // Iterate over all lines
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].split(';');

                    // If line is valid
                    if (line[0].length > 10) {

                        if (!this.nipix.hasOwnProperty(line[0])) {
                            this.nipix[line[0]] = {};
                        }


                        if ((typeof line[1] == 'string') && (line[1].indexOf('_') != -1)) {
                            line[1] = line[1].substr(0, line[1].indexOf('_'));
                        }

                        if (!this.nipix[line[0]].hasOwnProperty(line[1])) {
                            this.nipix[line[0]][line[1]] = {};
                        }

                        const nval = {};

                        nval['index'] = line[4];
                        nval['faelle'] = Math.round(Number(line[3].replace(',', '.')));

                        if (nval['index'] != '') {
                            this.nipix[line[0]][line[1]][line[2]] = nval;
                        }

                    }
                }

                // Update NiPix category
                this.nicat = Object.keys(this.nipix);

                setTimeout(this.onPanelChange.bind(this), 50, {'nextState': true, 'panelId': 'static-0'});
            });
    }

    /**
     * Download current Diagram Data as csv
     */
    exportAsImage() {

        const mergeHide = {
            toolbox: {
                show: false
            },
            dataZoom: [
                <any>{
                    type: 'slider',
                    show: false
                }
            ],
            xAxis: [
                {
                    id: 'xds',
                    show: false
                }

            ],
            yAxis: [
                {
                    id: 'yds',
                    show: false
                }
            ],
            series: [
                {
                    id: 'a',
                    areaStyle: {
                        color: "#fff"
                    },
                    itemStyle: {
                        color: '#fff'
                    }
                }
            ]
        };

        const mergeShow = {
            toolbox: {
                show: true
            },
            dataZoom: [
                <any>{
                    type: 'slider',
                    show: true
                }
            ],
            xAxis: [
                {
                    id: 'xds',
                    show: true
                }

            ],
            yAxis: [
                {
                    id: 'yds',
                    show: true
                }
            ],
            series: [
                {
                    id: 'a',
                    areaStyle: {
                        color: "#ccc"
                    },
                    itemStyle: {
                        color: '#ccc'
                    }
                }
            ]
        };


        this.chart.setOption(mergeHide);

        let img = this.chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        this.chart.setOption(mergeShow);

        downloadFile(img, "nipix.png", "", true);
    }

    /**
     * Download current Diagram Data as csv
     */
    exportCSV() {
        this.exportNiPixGeoJson(false);
    }


    /*
     * Download GeoJSON fronm Map
     */
    exportGeoJSON() {
        const data = echarts.getMap('NDS').geoJson;

        let filter = [];

        if (this.activeSelection != 99) { // Selected WoMa
            filter = this.draw[0].values;
        } else { // Meine WoMa Region
            filter.push(this.selectedMyRegion);
        }

        for (let i = 0; i < data['features'].length; i++) {
            if (!filter.includes(data['features'][i]['properties']['name'])) {
                data['features'][i] = null;
            }
        }

        data['features'] = data['features'].filter(function (el) {
            return el != null;
        });

        downloadFile(JSON.stringify(data), 'Wohnungsmarktregionen.geojson');
    }

    /**
     * Export GeoJSON with Nipix
     */
    exportNiPixGeoJson(geoJSON = true) {
        const chartoptions = this.chart.getOption();
        const tstart = chartoptions['dataZoom'][0]['start'];
        const tend = chartoptions['dataZoom'][0]['end'];
        const date = chartoptions['xAxis'][0]['data'];
        const series = chartoptions['series'];
        const istart = Math.trunc(date.length * tstart / 100);
        const iend = Math.trunc(date.length * tend / 100);

        const tmp = [];

        const geoData = echarts.getMap('NDS').geoJson;

        // Iterate over all draw items
        for (let d = 0; d < this.draw.length; d++) {
            const drawitem = this.draw[d];

            if (drawitem['show']) {
                if (geoJSON) {
                    if (drawitem['type'] == 'single') {
                        for (let s = 0; s < drawitem['values'].length; s++) {
                            const feature = getSingleFeature(geoData, drawitem['values'][s]);
                            if (!feature.hasOwnProperty('properties')) {
                                feature['properties'] = {};
                            }
                            feature['properties']['nipix'] = {
                                'type': drawitem['nipixCategory'],
                                'data': getNiPixTimeslot(date, series, drawitem['values'][s], istart, iend, this.hiddendata)
                            };

                            tmp.push(feature);
                        }
                    } else if (drawitem['type'] == 'aggr') {
                        const feature = {
                            'type': 'Feature',
                            'properties': {
                                'name': drawitem['name'],
                                'nipix': {
                                    'type': drawitem['nipixCategory'],
                                    'data': getNiPixTimeslot(date, series, drawitem['name'], istart, iend, this.hiddendata)
                                }
                            },
                            'geometry': getGeometryArray(geoData, drawitem['values'])
                        };

                        tmp.push(feature);

                    }
                } else {
                    if (drawitem['type'] == 'single') {
                        for (let s = 0; s < drawitem['values'].length; s++) {
                            const nipix = getNiPixTimeslot(date, series, drawitem['values'][s], istart, iend, this.hiddendata);
                            if (nipix.length > 0) {
                                for (let n = 0; n < nipix.length; n++) {
                                    tmp.push({
                                        'type': drawitem['nipixCategory'],
                                        'region': this.myRegionen[drawitem['values'][s]]['name'],
                                        'nipix': nipix[n]
                                    });
                                }
                            }
                        }
                    } else if (drawitem['type'] == 'aggr') {
                        const nipix = getNiPixTimeslot(date, series, drawitem['name'], istart, iend, this.hiddendata);
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
                }
            }


        }

        if (geoJSON) {
            const geoJson = {
                'type': 'FeatureCollection',
                'name': 'womareg',
                'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:EPSG::3044'}},
                'features': tmp
            };

            downloadFile(JSON.stringify(geoJson), 'Immobilienpreisindex.geojson');


        } else {  // CSV
            let csv = '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n';
            csv += convertArrayToCSV(tmp, ['type', 'region', 'nipix.date', 'nipix.index', 'nipix.sales']);

            downloadFile(csv, 'Immobilienpreisindex.csv');
        }
    }

    /**
     * Format Series Label
     *
     * @param params eCharts Formatter parameter (see echarts api)
     *
     * @return Formatted String
     */
    formatLabel = function (params) {

        if (params.dataIndex == this.rangeEndIndex) {

            if (params.seriesIndex == 0) {
                this.legendposition = [];
            }

            let printlegend = true;
            const pixel = Math.round(this.chart.convertToPixel({'yAxisIndex': 0}, params.data));

            for (let i = 0; i < this.legendposition.length; i++) {
                // Default fontSize: 18px
                if ((pixel > this.legendposition[i] - 10) && (pixel < this.legendposition[i] + 10)) {
                    printlegend = false;
                }
            }

            if ((this.selectedChartLine != '') && (this.selectedChartLine != name)) {
                printlegend = false;
            }

            if (printlegend) {
                this.legendposition.push(pixel);
                if (this.shortNames.hasOwnProperty(params.seriesName)) {
                    return this.shortNames[params.seriesName];
                } else if (this.myRegionen.hasOwnProperty(params.seriesName)) {
                    return this.myRegionen[params.seriesName]['short'];
                } else {
                    return params.seriesName;
                }
            }
        }

        return '';
    };

    /**
     * Generates the drawdata from the given draw array
     */
    generateDrawData(draw) {

        // Empty result
        const res = [];

        // Iterate over all draw items
        for (let d = 0; d < draw.length; d++) {
            const drawitem = draw[d];

            // Type Single: display all values as an individual series
            if (drawitem['type'] == 'single') {

                // Iterate over all Regions
                // let reg = Object.keys(this.myRegionen);
                for (let i = 0; i < this.allItems.length; i++) {

                    const value = this.allItems[i]; // drawitem["values"][i];
                    const nipix = this.nipix[drawitem.nipixCategory];

                    // Region included, drawitem show and data available
                    if (
                        drawitem['values'].includes(value) &&
                        (this.nipix.hasOwnProperty(drawitem.nipixCategory)) &&
                        (this.nipix[drawitem.nipixCategory].hasOwnProperty(value)) &&
                        (drawitem['show'] == true) &&
                        (Object.getOwnPropertyNames(this.nipix[drawitem.nipixCategory][value]).length > 0)
                    ) {

                        // Calc reference value on referenceDate
                        let reference = 100;
                        if (this.nipix[drawitem.nipixCategory][value].hasOwnProperty(this.referenceDate)) {
                            reference = parseFloat(this.nipix[drawitem.nipixCategory][value][this.referenceDate].index.replace(',', '.'));
                        }

                        // Add Series
                        res.push(
                            generateSeries(
                                value,
                                generateDrawSeriesData(this.nipix[drawitem.nipixCategory][value], this.date, 'index', reference),
                                this.myRegionen[value]['color'],
                                this.formatLabel.bind(this),
                                this.selectedChartLine
                            )
                        );
                        this.hiddendata[value] = generateDrawSeriesData(this.nipix[drawitem.nipixCategory][value], this.date, 'faelle');
                    } else if (
                        drawitem['values'].includes(value) &&
                        (drawitem['show'] == true)
                    ) {
                        res.push(
                            generateSeries(
                                value,
                                [],
                                this.myRegionen[value]['color'],
                                this.formatLabel.bind(this),
                                this.selectedChartLine
                            )
                        );

                    }

                }

                // Type Aggr: display all values as an aggregated series
            } else if (drawitem['type'] == 'aggr') {

                const a_val = [];
                const a_faelle = [];

                let reference = 100;

                // Display?
                if ((drawitem['show'] == true) && (drawitem['values'].length > 0)) {
                    for (let d = 0; d < this.date.length; d++) {

                        let aggr_val = 0;
                        let aggr_faelle = 0;

                        // Iterate over all values for this aggregation
                        for (let i = 0; i < drawitem['values'].length; i++) {

                            const value = drawitem['values'][i];
                            const data = this.nipix[drawitem.nipixCategory][value];

                            // Data available?
                            if (data !== undefined) {

                                // Calculate reference for referenceDate
                                reference = 100;
                                if (data.hasOwnProperty(this.referenceDate)) {
                                    reference = parseFloat(data[this.referenceDate].index.replace(',', '.'));
                                }

                                // Add Value to aggregation Var
                                if (data.hasOwnProperty(this.date[d].replace('/', '_'))) {
                                    let val = data[this.date[d].replace('/', '_')].index;
                                    let fal = data[this.date[d].replace('/', '_')].faelle;

                                    if (typeof val == 'string') {
                                        val = parseFloat(val.replace(',', '.'));
                                    }

                                    val += (100 - reference);

                                    if (typeof fal == 'string') {
                                        fal = parseFloat(fal.replace(',', '.'));
                                    }

                                    if (!isNaN(val)) {
                                        aggr_val += val * fal;
                                        aggr_faelle += fal;
                                    }
                                }
                            }
                        }


                        // Calc aggregated Value for a specific date
                        const pval = parseFloat((aggr_val / aggr_faelle).toFixed(2));

                        a_val.push(pval);
                        a_faelle.push(aggr_faelle);

                        if (this.date[d].replace('/', '_') == this.referenceDate) {
                            reference = pval;
                        }
                    }

                    // Add Series to Output
                    res.push(
                        generateSeries(
                            drawitem['name'],
                            generateDrawSeriesData(a_val, this.date, null, 100), // reference),
                            drawitem['colors'],
                            this.formatLabel.bind(this),
                            this.selectedChartLine
                        )
                    );
                    this.hiddendata[drawitem['name']] = generateDrawSeriesData(a_faelle, this.date);
                }

            }

        }

        return res;
    }


    /**
     * Set Map Options
     */
    setMapOptions(selectType: any = 'multiple') {

        // update options:
        this.options = {
            'title': {
                'text': 'Wohnungsmarktregionen in Niedersachsen',
                'left': 'center',
                'top': 10
            },
            graphic: [
                {
                    type: 'text',
                    id: 'copyright',
                    right: 90,
                    bottom: 40,
                    z: 100,
                    style: {
                        fill: '#333',
                        textAlign: 'right',
                        text: '© Oberer Gutachterausschusses für\nGrundstückswerte in Niedersachsen, ' + getDate()
                    }
                }
            ],

            'tooltip': {
                'trigger': 'item',
                'showDelay': 0,
                'transitionDuration': 0.2,
                'formatter': function (params) {
                    if (this.myRegionen.hasOwnProperty(params.name)) {
                        return this.myRegionen[params.name]['name'];
                    } else {
                        return params.name;
                    }
                }.bind(this)
            },
            'toolbox': {
                'show': true,
                'orient': 'vertical',
                'itemSize': 30,
                'itemGap': 20,
                'right': 5,
                'top': 110,
                'feature': {
                    'saveAsImage': {
                        'show': true,
                        'title': 'Bild',
                        'icon': 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'
                    },
                    'mySaveAsGeoJSON': {
                        'show': true,
                        'title': 'GeoJSON',
                        'icon': 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z',
                        'onclick': this.exportGeoJSON.bind(this)
                    }
                }
            },
            'geo': {
                'map': 'NDS',
                'roam': false,
                'aspectScale': 1,
                'show': false
            },
            'series': [
                {
                    'name': 'Wohnungsmarktregionen in Niedersachsen',
                    'type': 'map',
                    'aspectScale': 1,
                    'roam': false,
                    'mapType': 'NDS', // map type should be registered
                    'itemStyle': {
                        'normal': {
                            'label': {
                                'show': false
                            }
                        },
                        'emphasis': {
                            'label': {
                                'show': false
                            }
                        }
                    },
                    'selectedMode': selectType,
                    'data': this.mapRegionen,
                },
                {
                    'type': 'effectScatter',
                    'coordinateSystem': 'geo',
                    'zlevel': 2,

                    'label': {
                        'normal': {
                            'show': true,
                            'position': 'right',
                            'offset': [5, 0],
                            'formatter': '{b}',
                            'backgroundColor': 'rgba(255,255,255,0.7)'
                        },
                        'emphasis': {
                            'show': true
                        }
                    },
                    'symbol': 'circle',
                    'symbolSize': 4,
                    'itemStyle': {
                        'normal': {
                            'show': true,
                        }
                    },
                    'data': this.geoCoordMap
                }

            ]
        };

        // Update Map Selection; Wait a little time for browser to render
        setTimeout(this.updateMapSelect.bind(this), 100);

    }

    /**
     * Handle the Change of an Selection in the Map
     */
    onMapSelectChange(param) {

        // Get List of selected items in map
        let selectedlist = null;
        if (param['type'] === 'mapselectchanged' && param['batch'] !== undefined && param['batch'] !== null) {
            selectedlist = param['batch'][0]['selected'];
        } else {
            selectedlist = param['selected'];
        }


        // Get keys of selected items
        const ok = Object.keys(selectedlist);

        // Iterate over all selected Regions and collect them in an array
        const nval = [];
        for (let i = 0; i < ok.length; i++) {
            if (selectedlist[ok[i]] == true) {
                nval.push(ok[i]);
            }
        }

        // Adds the current selection state to the draw item
        this.draw[0].values = nval;

        // Finally Update chart
        this.updateChart();
    }

    /**
     * Toggle the Selection of an Subitem
     */
    toggleMapSelect(category, name, typ = 'undefined') {

        this.resetHighlight();

        // Iterate over draw to find the correct draw item
        for (let i = 0; i < this.draw.length; i++) {
            if (this.draw[i].name == category) {

                // Remove item from values array; unselect map
                if (this.draw[i].values.includes(name)) {

                    const indexToDelete = this.draw[i].values.indexOf(name);
                    const nArr = this.draw[i].values.slice(0, indexToDelete).concat(this.draw[i].values.slice(indexToDelete + 1, this.draw[i].values.length));
                    this.draw[i].values = nArr;

                    // Update Map if tab selected
                    if (typ == 'single') {
                        this.map.dispatchAction({
                            type: 'mapUnSelect',
                            name
                        });
                    }

                    // Add item to values array; select map
                } else {
                    this.draw[i].values.push(name);

                    // Update Map if tab selected
                    if (typ == 'single') {
                        this.map.dispatchAction({
                            type: 'mapSelect',
                            name
                        });
                    }

                }
            }

        }

        // Finally Update the chart
        this.updateChart();
    }


    /**
     * Update the Selectiopn of the Map aware of the activer Draw Item
     */
    updateMapSelect(id = null) {

        if (this.activeSelection !== 99) {
            if (this.selection[this.activeSelection]['type'] == 'single') {
                const draw = this.getDraw(this.selection[this.activeSelection]['preset'][0]);
                const reg = Object.keys(this.myRegionen);
                for (let s = 0; s < reg.length; s++) {
                    if (draw.values.includes(reg[s])) {
                        // Select
                        this.map.dispatchAction({
                            type: 'mapSelect',
                            name: reg[s]
                        });
                    } else {
                        // Unselect
                        this.map.dispatchAction({
                            type: 'mapUnSelect',
                            name: reg[s]
                        });

                    }
                }
            } else {
                // All other drawing types; unselect
                const reg = Object.keys(this.myRegionen);
                for (let s = 0; s < reg.length; s++) {
                    // Unselect
                    this.map.dispatchAction({
                        type: 'mapUnSelect',
                        name: reg[s]
                    });
                }
            }
        } else {
            // Update MyWoMaReg
            if (id !== null) {
                const reg = Object.keys(this.myRegionen);
                for (let s = 0; s < reg.length; s++) {
                    if (reg[s] == id) {
                        // Select
                        this.map.dispatchAction({
                            type: 'mapSelect',
                            name: reg[s]
                        });
                    } else {
                        // Unselect
                        this.map.dispatchAction({
                            type: 'mapUnSelect',
                            name: reg[s]
                        });

                    }
                }

            }
        }
    }


    /**
     * Gets chart element for map
     */
    onChartInit(ec) {
        this.map = ec;
        this.updateMapSelect();
    }

    /**
     * Gets chart element for Chart
     */
    onChartChartInit(ec) {
        this.chart = ec;
        this.updateChart();
    }


    /**
     * Change between NiPix Category (Eigenheime, Wohnungen)
     */
    onChangeCat(index, cat) {
        if (Array.isArray(index)) {
            for (let i = 0; i < index.length; i++) {
                for (let d = 0; d < this.draw.length; d++) {
                    if (this.draw[d]['name'] == index[i]) {
                        this.draw[d].nipixCategory = cat;
                        this.updateChart();
                    }
                }
            }
        } else {
            for (let d = 0; d < this.draw.length; d++) {
                if (this.draw[d]['name'] == index) {
                    this.draw[d].nipixCategory = cat;
                    this.updateChart();
                    return;
                }

            }
        }

    }

    /**
     * Switch between multiple Draw Items
     */
    onClickDrawRoot(name) {
        // this.selectedTreeItem = name;
        this.updateMapSelect();
        this.updateChart();
    }

    /**
     * Toggle Show of Draw Item
     */
    onToggleDrawRoot(name) {
        for (let i = 0; i < this.draw.length; i++) {
            if (this.draw[i].name == name) {
                this.draw[i].show = !this.draw[i].show;
            }
        }
        this.updateChart();
    }


    /**
     * Update Chart
     */
    updateChart(start = null, end = null) {

        let range_start = this.chart_range['data'][2][0]; // Math.trunc(100 * this.date.indexOf(this.referenceDate.replace("_","/"))/this.date.length);
        let range_end = this.chart_range['data'][3][0]; // 100;

        if (this.rangeStartIndex == 0) {
            this.rangeStartIndex = Math.round((this.date.length - 1) / 100 * range_start);
            this.referenceDate = this.date[this.rangeStartIndex].replace('/', '_');
        }

        if (this.rangeEndIndex == 0) {
            this.rangeEndIndex = Math.round((this.date.length - 1) / 100 * range_end);
        }

        const range_text = "Zeitraum von " + this.date[this.rangeStartIndex] + " bis " + this.date[this.rangeEndIndex];

        if (start !== null) {
            range_start = start;
        }

        if (end !== null) {
            range_end = end;
        }

        // Regenerate Drawdata
        this.drawdata = this.generateDrawData(this.draw);

        // Regenerate Series
        const chartOptionMerge = {
            series: this.drawdata,
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0],
                    realtime: false,
                    start: range_start,
                    end: range_end,
                    bottom: 30,
                    height: 20,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '120%'
                }
            ]

        };

        const legend = [];
        const empty = [];
        for (let i = 0; i < chartOptionMerge.series.length; i++) {
            legend.push(chartOptionMerge.series[i]['name']);
            if (chartOptionMerge.series[i]['data'].length == 0) {
                empty.push(chartOptionMerge.series[i]['name']);
            }
        }

        chartOptionMerge.series.push(this.chart_range);

        let infotext = '';

        if (this.selection[this.activeSelection] !== undefined && this.selection[this.activeSelection] !== null) {
            if ((this.selection[this.activeSelection]['type'] == 'single') || (this.selection[this.activeSelection]['type'] == 'multiIndex')) {

                const ccat = this.getDraw(this.selection[this.activeSelection]['preset'][0]);
                infotext = ccat['nipixCategory'] + '\n';
                if (legend.length < 4) {
                    const infoseries = [];
                    for (let i = 0; i < legend.length; i++) {
                        if (this.myRegionen.hasOwnProperty(legend[i])) {
                            infoseries.push(this.myRegionen[legend[i]]['name']);
                        } else {
                            infoseries.push(legend[i]);
                        }
                    }
                    infotext += infoseries.join(', ');
                }
            } else if ((this.selection[this.activeSelection]['type'] == 'multi')) {
                const ccat = this.selection[this.activeSelection]['preset'];
                for (let i = 0; i < ccat.length; i++) {
                    infotext += this.shortNames[ccat[i]] + ': ' + ccat[i] + '\n';
                }
            } else if ((this.selection[this.activeSelection]['type'] == 'multiSelect')) {
                const ccat = this.selection[this.activeSelection]['preset'];
                for (let i = 0; i < ccat.length; i++) {
                    const citem = this.getDraw(ccat[i]);
                    if (citem['show'] == true) {
                        const items = [];

                        for (let v = 0; v < citem['values'].length; v++) {
                            items.push(this.myRegionen[citem['values'][v]]['short']);
                        }

                        infotext += ccat[i] + ': ' + items.join(' ') + '\n';
                    }
                }

            }
        }

        if (empty.length > 0) {
            const emptyseries = [];
            for (let i = 0; i < empty.length; i++) {
                if (this.myRegionen.hasOwnProperty(empty[i])) {
                    emptyseries.push(this.myRegionen[empty[i]]['name'] + ' (' + this.myRegionen[empty[i]]['short'] + ')');
                } else {
                    emptyseries.push(empty[i]);
                }
            }
            infotext += 'ohne Daten: ' + emptyseries.join(', ');
        }

        chartOptionMerge['graphic'] = [
            this.chartOption['graphic'][0],
            {
                type: 'text',
                id: 'info',
                left: 65,
                top: 65,
                z: 100,
                style: {
                    fill: '#333',
                    textAlign: 'left',
                    text: infotext
                }
            },
            {
                type: 'text',
                id: 'zeitraum',
                scale: [1.3,1.3],
                left: 'center',
                //rifht: 0,
                top: 108,
                z: 101,
                style: {
                    fill: '#333',
                    textAlign: 'center',
                    text: range_text
                }
            }
        ];

        chartOptionMerge['legend'] = {
            'show': false,
            'top': 60,
            'z': -1,
            'data': legend,
            'formatter': function (name) {
                if (this.shortNames.hasOwnProperty(name)) {
                    return this.shortNames[name];
                } else if (this.myRegionen.hasOwnProperty(name)) {
                    return this.myRegionen[name]['short'];
                } else {
                    return name;
                }
            }.bind(this)
        };

        chartOptionMerge['title'] = {
            'text': 'Niedersächsischer Immobilienpreisindex (NIPIX)',
            'subtext': this.chartTitle,
            'left': 'center',
            'top': 10
        };
        // Set Options to chart
        if (this.chart != null) {
            this.chart.setOption(Object.assign(this.chartOption, chartOptionMerge), true, true);
        }


    }

    /**
     * Handle Chart DataZoom
     */
    onDataZoom(event) {
        this.chart_range['data'][2] = [event.start, -1];
        this.chart_range['data'][3] = [event.end, -1];
        this.rangeStartIndex = Math.round((this.date.length - 1) / 100 * event.start);
        this.rangeEndIndex = Math.round((this.date.length - 1) / 100 * event.end);
        this.referenceDate = this.date[this.rangeStartIndex].replace('/', '_');
        this.updateChart(event.start, event.end);
    }

    /**
     * Focus single ChartLine
     */
    chartClicked(event) {
        if ((event.componentType === 'series') && (event.seriesType === 'line')) {
            this.selectedChartLine = event.seriesName;
            this.updateChart();
        }
    }

    /**
     * Handle Accordeon PanelChange
     */
    onPanelChange(event) {
        // False will not be fired unless manual accordeon close
        if (event.nextState == true) {

            this.activeSelection = parseInt(event.panelId.replace('static-', ''));

            // Disable all; exclude WomaDiscover
            if (event.panelId != 'static-99') {
                for (let i = 0; i < this.draw.length; i++) {
                    this.draw[i].show = false;
                }

                const selection_id = parseInt(event.panelId.replace('static-', ''));

                if (this.selection[selection_id] !== undefined && this.selection[selection_id] !== null) {
                    if (this.selection[selection_id]['type'] == 'multiSelect') {
                        this.onSetSpecificDraw(this.selection[selection_id]['preset'], this.selection[selection_id]['selected']);
                    } else {
                        this.onSetSpecificDraw(this.selection[selection_id]['preset'], this.selection[selection_id]['preset'].length);
                    }

                    this.chartTitle = this.selection[selection_id]['name'];
                }

                this.selectedChartLine = '';

                this.updateChart();
                this.mapRegionen = getMyMapRegionen(modifyRegionen(this.myRegionen, this.draw.filter(drawitem => (drawitem['show'] == true && drawitem['type'] != 'single'))), null, null, true);
                if (this.selection[selection_id]['type'] == 'single') {
                    this.setMapOptions();
                } else {
                    this.setMapOptions(false);
                }
                // this.updateMapSelect();
            } else {
                this.mapRegionen = getMyMapRegionen(this.myRegionen, null, null, true);
                this.setMapOptions(false);
                this.updateMapSelect(this.selectedMyRegion);
            }
        }
    }

    /**
     * Toggle All for specific draw
     *
     * @param drawname Name of the draw Object
     */
    toggleAllSelect(drawname) {
        this.resetHighlight();
        for (let i = 0; i < this.draw.length; i++) {
            if (this.draw[i]['name'] == drawname) {
                if (this.draw[i].values.length > 0) {
                    this.draw[i].values = [];
                } else {
                    this.draw[i].values = this.allItems;
                }
                this.updateMapSelect();
                this.updateChart();
                return;
            }
        }

    }

    /**
     * Get the Region Name for "Find My WoMaReg".
     * Handle found WoMaReg.
     *
     * @param WoMa Region ID
     *
     * @return WoMaReg Name
     */
    regionName(id) {
        if ((id !== undefined) && (this.myRegionen.hasOwnProperty(id))) {
            if (this.selectedMyRegion != id) {
                this.selectedMyRegion = id;

                this.updateMapSelect(id);
            }
            return this.myRegionen[id].name;
        } else {
            return '';
        }
    }

    /**
     * Gets the color for a specific series
     *
     * @param series series id
     *
     * @return Series Color
     */
    getSeriesColor(series) {
        return convertColor(this.myRegionen[series]['color']);
    }

    /**
     * Get Label for a specific Series
     *
     * @param series series Id
     *
     * @return series label (sort)
     */
    getSeriesLabel(series) {
        return this.myRegionen[series]['name'] + ' (' + this.myRegionen[series]['short'] + ')';
    }

    /**
     * Get custom color
     *
     * @param name draw name
     *
     * @return color Color
     */
    getCustomColor(name) {
        const draw = this.getDraw(name);

        if (draw && draw['colors'].length > 0) {
            return convertColor(draw['colors']);
        } else {
            return 'transparent';
        }
    }

    /**
     * Set show for a specific preset and count
     *
     * @param preset Array of preset
     * @param count Amount of items
     */
    onSetSpecificDraw(preset, count) {
        for (let i = 0; i < preset.length; i++) {
            for (let d = 0; d < this.draw.length; d++) {
                if (this.draw[d]['name'] == preset[i]) {
                    if (i >= count) {
                        this.draw[d]['show'] = false;
                    } else {
                        this.draw[d]['show'] = true;
                    }
                }
            }
        }

    }

    /**
     * Set amount (count) of drawable items (multiSelect)
     *
     * @param selectname Name of the selection
     * @param count Amount
     */
    onSetNumber(selectname, count) {
        for (let s = 0; s < this.selection.length; s++) {
            if (this.selection[s]['name'] == selectname) {
                this.selection[s]['selected'] = count;

                if (count > this.selection[s]['preset'].length) {
                    count = this.selection[s]['preset'].length;
                }

                this.onSetSpecificDraw(this.selection[s]['preset'], count);

                this.updateChart();
                return;
            }
        }
    }

    /**
     * Get draw object for a specific name
     *
     * @param name Name of the draw Object
     *
     * @return draw Object
     */
    getDraw(name) {
        const result = this.draw.filter(drawitem => drawitem['name'] == name);

        if (result.length == 1) {
            return result[0];
        } else {
            return null;
        }
    }

    /**
     * Toggle the NiPix Category (Eigenheime/Eigentumswohnungen) for a specific draw object.
     *
     * @param drawname Name of the draw object.
     */
    toggleNipixCategory(drawname) {
        for (let i = 0; i < this.draw.length; i++) {
            if (this.draw[i]['name'] == drawname) {
                if (this.draw[i]['nipixCategory'] == 'gebrauchte Eigenheime') {
                    this.draw[i]['nipixCategory'] = 'gebrauchte Eigentumswohnungen';
                } else {
                    this.draw[i]['nipixCategory'] = 'gebrauchte Eigenheime';
                }
                this.updateChart();
                return;
            }
        }
    }

    /**
     * timeout handler for diable highlight
     */
    highlightTimeout() {
        this.highlightedSeries = '';
        this.updateMapSelect();
    }

    /**
     * Highlight one Series (while mouse over)
     *
     * @param seriesName name of the series to highlight
     */
    highlightSeries(seriesName) {
        if (this.highlightedSeries != seriesName) {
            this.highlightedSeries = seriesName;

            const rkey = Object.keys(this.myRegionen);
            let rname = [];

            if (rkey.includes(seriesName)) {
                rname.push(seriesName);
            } else {
                rname = this.getDraw(seriesName)['values'];
            }

            for (let i = 0; i < rkey.length; i++) {
                if (rname.includes(rkey[i])) {
                    // Select
                    this.map.dispatchAction({
                        type: 'mapSelect',
                        name: rkey[i]
                    });
                } else {
                    // Unselect
                    this.map.dispatchAction({
                        type: 'mapUnSelect',
                        name: rkey[i]
                    });

                }
            }

        }
        clearTimeout(this.highlightedTimeout);
        this.highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);
    }

    /**
     * Reset the highlighted Map (before) timeout
     */
    resetHighlight() {
        clearTimeout(this.highlightedTimeout);
        this.highlightedSeries = '';
        this.updateMapSelect();
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
