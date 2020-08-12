import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {NgbAccordion, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import * as ImmobilenChartOptions from './immobilien.chartoptions';
import * as ImmobilienHelper from './immobilien.helper';
import * as ImmobilienUtils from './immobilien.utils';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilenNipixRuntime from './immobilien.runtime';

import * as echarts from 'echarts';

declare const require: any;

@Component({
    selector: 'power-immobilien',
    templateUrl: './immobilien.component.html',
    styleUrls: ['./immobilien.component.scss']
})
export class ImmobilienComponent implements OnInit {

    // Config URl
    configUrl = 'assets/data/cfg.json';

    // Nipix Static Data
    nipixStatic = new ImmobilenNipixStatic.NipixStatic();

    // Nipix Runtime Data
    nipixRuntime = new ImmobilenNipixRuntime.NipixRuntime(this.nipixStatic);

    @ViewChild('acc', {static: true}) accordionComponent: NgbAccordion;
    model: any;

    @ViewChild('searchWoMaReg') searchWoMaReg: NgbTypeahead;

    /**
     * Constructor:
     *
     * @param http Inject HttpClient
     * @param titleService Service for settings the title of the HTML document
     */
    constructor(
        private http: HttpClient,
        private titleService: Title
    ) {
        this.titleService.setTitle('Immobilienpreisindex - POWER.NI');
    }

    title = 'lgln';

    // Icon array
    iconFor = {
        'gebrauchte Eigenheime': 'fa-home',
        'gebrauchte Eigentumswohnungen': 'fa-building',
    };

    // show loading spinner:
    mapLoaded = false;

    // Find My WomaReg
    focus$ = new Subject<string>();
    click$ = new Subject<string>();


    /**
     * echart_range_series
     */
    chart_range = ImmobilenChartOptions.chartRange();

    // Find My WomaReg
    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.searchWoMaReg.isPopupOpen()));
        const inputFocus$ = this.focus$;

        const gem = this.nipixStatic.data.gemeinden;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map(term => (term === '' ? Object.keys(gem)
                : Object.keys(gem).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
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
                this.nipixRuntime.state.initState = 1;
                this.nipixStatic.loadConfig(json);
                this.nipixRuntime.resetDrawPresets();
                this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
                    this.nipixStatic.data.regionen,
                    null,
                    null,
                    true
                );
                this.nipixRuntime.calculated.chartTitle = this.nipixStatic.data.selections[0]['name'];
                this.nipixRuntime.availableQuartal = ImmobilienUtils.getDateArray(json['lastYear'], json['lastPeriod']);
                this.nipixRuntime.updateAvailableQuartal(json['lastYear'], json['lastPeriod']);
                this.nipixRuntime.chart.options = ImmobilenChartOptions.getChartOptions.bind(this)({
                    'text': this.nipixStatic.textOptions,
                    'date': this.nipixRuntime.availableQuartal,
                    'tooltipFormatter': this.nipixRuntime.formatter.chartTooltipFormatter,
                    'exportAsImage': this.exportAsImage.bind(this),
                    'exportCSV': this.exportCSV.bind(this),
                    'exportNiPixGeoJson': this.exportNiPixGeoJson.bind(this)
                });
                this.loadGemeinden(json['gemeindenUrl']);
                this.loadGeoMap(json['mapUrl']);
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
                this.nipixStatic.parseGemeinden(gem);

                // InitState
                this.nipixRuntime.state.initState++;
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

                    // initState
                    this.nipixRuntime.state.initState++;

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

                this.nipixStatic.parseNipix(nipix);
                this.nipixRuntime.updateAvailableNipixCategories();

                // InitState
                this.nipixRuntime.state.initState++;

                setTimeout(this.onPanelChange.bind(this), 50, {'nextState': true, 'panelId': 'static-0'});
            });
    }

    /**
     * Download current Diagram Data as csv
     */
    exportAsImage() {
        this.nipixRuntime.export.exportAsImage();
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
        this.nipixRuntime.export.exportGeoJSON();
    }

    /**
     * Export GeoJSON with Nipix
     */
    exportNiPixGeoJson(geoJSON = true) {
        this.nipixRuntime.export.exportNiPixGeoJson(geoJSON);
    }

    /**
     * Set Map Options
     */
    setMapOptions(selectType: any = 'multiple') {

        this.nipixRuntime.map.options = ImmobilenChartOptions.getMapOptions.bind(this)({
            'text': this.nipixStatic.textOptions,
            'tooltipFormatter': this.nipixRuntime.formatter.mapTooltipFormatter,
            'exportGeoJSON': this.exportGeoJSON.bind(this),
            'mapRegionen': this.nipixRuntime.calculated.mapRegionen,
            'geoCoordMap': this.nipixStatic.data.geoCoordMap
        }, selectType);
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
            if (selectedlist[ok[i]] === true) {
                nval.push(ok[i]);
            }
        }

        // Adds the current selection state to the draw item
        this.nipixRuntime.drawPresets[0].values = nval;

        // Finally Update chart
        this.updateChart();
    }

    /**
     * Toggle the Selection of an Subitem
     */
    toggleMapSelect(category, name, typ = 'undefined') {
        this.resetHighlight();
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i].name === category) {

                // Remove item from values array; unselect map
                if (this.nipixRuntime.drawPresets[i].values.includes(name)) {
                    const indexToDelete = this.nipixRuntime.drawPresets[i].values.indexOf(name);
                    const nArr = this.nipixRuntime.drawPresets[i].values.slice(0, indexToDelete).concat(
                        this.nipixRuntime.drawPresets[i].values.slice(
                            indexToDelete + 1,
                            this.nipixRuntime.drawPresets[i].values.length
                        )
                    );
                    this.nipixRuntime.drawPresets[i].values = nArr;
                    if (typ === 'single') {
                        ImmobilienUtils.dispatchMapSelect(this.nipixRuntime.map.obj, name, false);
                    }
                } else { // Add item to values array; select map
                    this.nipixRuntime.drawPresets[i].values.push(name);
                    if (typ === 'single') {
                        ImmobilienUtils.dispatchMapSelect(this.nipixRuntime.map.obj, name, true);
                    }
                }
            }
        }
        this.updateChart(); // Finally Update the chart
    }


    /**
     * Update the Selectiopn of the Map aware of the activer Draw Item
     */
    updateMapSelect(id = null) {
        this.nipixRuntime.updateMapSelect(id);
    }


    /**
     * Gets chart element for map
     */
    onChartInit(ec) {
        this.nipixRuntime.map.obj = ec;

        if (this.nipixRuntime.state.initState === 4) {
            this.updateMapSelect();
        }
    }

    /**
     * Gets chart element for Chart
     */
    onChartChartInit(ec) {
        this.nipixRuntime.chart.obj = ec;

        if (this.nipixRuntime.state.initState === 4) {
            this.updateChart();
        }
    }

    /**
     * Finish Randering
     */
    onChartFinished(ec) {
        this.nipixRuntime.export.chartRenderFinished();
    }


    /**
     * Change between NiPix Category (Eigenheime, Wohnungen)
     */
    onChangeCat(index, cat) {
        if (Array.isArray(index)) {
            for (let i = 0; i < index.length; i++) {
                for (let d = 0; d < this.nipixRuntime.drawPresets.length; d++) {
                    if (this.nipixRuntime.drawPresets[d]['name'] === index[i]) {
                        this.nipixRuntime.drawPresets[d].nipixCategory = cat;
                        this.updateChart();
                    }
                }
            }
        } else {
            for (let d = 0; d < this.nipixRuntime.drawPresets.length; d++) {
                if (this.nipixRuntime.drawPresets[d]['name'] === index) {
                    this.nipixRuntime.drawPresets[d].nipixCategory = cat;
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
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i].name === name) {
                this.nipixRuntime.drawPresets[i].show = !this.nipixRuntime.drawPresets[i].show;
            }
        }
        this.updateChart();
    }

    /**
     * Update Chart
     */
    updateChart(start = null, end = null) {
        let range_start = this.chart_range['data'][2][0];
        let range_end = this.chart_range['data'][3][0]; // 100;
        let subAdd = ''; // Additional subtitle
        if (start !== null) {
            range_start = start;
        }
        if (end !== null) {
            range_end = end;
        }
        this.nipixRuntime.updateRange(range_start, range_end);

        const range_text = 'Zeitraum von ' +
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeStartIndex] +
            ' bis ' +
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeEndIndex];

        this.nipixRuntime.calculateDrawData();

        if (this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection] !== undefined
            && this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection] !== null) {
            if ((this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['type'] === 'single')) {
                const ccat = this.nipixRuntime.getDrawPreset(
                    this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['preset'][0]
                );
                subAdd = ' (' + ccat['nipixCategory'] + ')';
            }
        }
        this.updateChartMerge(range_start, range_end, subAdd, range_text);
    }

    /**
     * Update Chart
     */
    updateChartMerge(range_start, range_end, subAdd, range_text) {
        const chartOptionMerge = ImmobilenChartOptions.getChartOptionsMerge({
            'graphic0': this.nipixRuntime.chart.options['graphic'][0],
            'graphic1left': this.nipixStatic.chartExportWidth - 600 + 65,
            'graphic1children': [].concat(this.nipixRuntime.formatter.graphicLegend()),
            'graphic2fontsize': ImmobilienHelper.convertRemToPixels(this.nipixStatic.textOptions.fontSizePage),
            'graphioc2text': range_text,
            'legenddata': this.nipixRuntime.formatter.simpleLegend(),
            'legendformatter':  this.nipixRuntime.formatter.formatLegend,
            'subtitle': this.nipixRuntime.calculated.chartTitle + subAdd,
            'series': this.nipixRuntime.calculated.drawData,
            'datastart': range_start,
            'dataend': range_end
        });
        chartOptionMerge.series.push(this.chart_range);

        // Set Options to chart
        if (this.nipixRuntime.chart.obj !== null) {
            this.nipixRuntime.chart.obj.setOption(
                Object.assign(this.nipixRuntime.chart.options, chartOptionMerge),
                true,
                true
            );
        }

    }

    /**
     * Handle Chart DataZoom
     */
    onDataZoom(event) {
        this.chart_range['data'][2] = [event.start, -1];
        this.chart_range['data'][3] = [event.end, -1];
        this.nipixRuntime.state.rangeStartIndex =
            Math.round((this.nipixRuntime.availableQuartal.length - 1) / 100 * event.start);
        this.nipixRuntime.state.rangeEndIndex =
            Math.round((this.nipixRuntime.availableQuartal.length - 1) / 100 * event.end);
        this.nipixStatic.referenceDate =
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeStartIndex].replace('/', '_');
        this.updateChart(event.start, event.end);
    }

    /**
     * Focus single ChartLine
     */
    chartClicked(event) {
        if ((event.componentType === 'series') && (event.seriesType === 'line')) {
            this.nipixRuntime.state.selectedChartLine = event.seriesName;
            this.updateChart();
        }
    }

    onPanelChangeWoMa() {
        this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
            this.nipixStatic.data.regionen,
            null,
            null,
            true
        );
        this.setMapOptions(false);
        this.updateMapSelect(this.nipixRuntime.state.selectedMyRegion);
    }

    onPanelChangeIndex(selection_id: number) {
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            this.nipixRuntime.drawPresets[i].show = false;
        }
        if (this.nipixStatic.data.selections[selection_id] !== undefined
            && this.nipixStatic.data.selections[selection_id] !== null
        ) {
            if (this.nipixStatic.data.selections[selection_id]['type'] === 'multiSelect') {
                this.onSetSpecificDraw(
                    this.nipixStatic.data.selections[selection_id]['preset'],
                    this.nipixStatic.data.selections[selection_id]['selected']);
            } else {
                this.onSetSpecificDraw(
                    this.nipixStatic.data.selections[selection_id]['preset'],
                    this.nipixStatic.data.selections[selection_id]['preset'].length);
            }
            this.nipixRuntime.calculated.chartTitle = this.nipixStatic.data.selections[selection_id]['name'];
        }
        this.nipixRuntime.state.selectedChartLine = '';
        this.updateChart();
        this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
            ImmobilienUtils.modifyRegionen(this.nipixStatic.data.regionen, this.nipixRuntime.drawPresets
                .filter(drawitem => (drawitem['show'] === true && drawitem['type'] !== 'single'))),
            null, null, true);
        if (this.nipixStatic.data.selections[selection_id]['type'] === 'single') {
            this.setMapOptions();
        } else {
            this.setMapOptions(false);
        }
    }

    /**
     * Handle Accordeon PanelChange
     */
    onPanelChange(event) {
        // False will not be fired unless manual accordeon close
        if (event.nextState === true) {

            this.nipixRuntime.state.activeSelection = parseInt( event.panelId.replace('static-', ''), 10);

            // Disable all; exclude WomaDiscover
            if (event.panelId !== 'static-99') {
                this.onPanelChangeIndex(parseInt( event.panelId.replace('static-', ''), 10));
            } else {
                this.onPanelChangeWoMa();
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
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i]['name'] === drawname) {
                if (this.nipixRuntime.drawPresets[i].values.length > 0) {
                    this.nipixRuntime.drawPresets[i].values = [];
                } else {
                    this.nipixRuntime.drawPresets[i].values = this.nipixStatic.data.allItems;
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
        if ((id !== undefined) && (this.nipixStatic.data.regionen.hasOwnProperty(id))) {
            if (this.nipixRuntime.state.selectedMyRegion !== id) {
                this.nipixRuntime.state.selectedMyRegion = id;

                this.updateMapSelect(id);
            }
            return this.nipixStatic.data.regionen[id].name;
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
        return ImmobilienHelper.convertColor(this.nipixStatic.data.regionen[series]['color']);
    }

    /**
     * Get Label for a specific Series
     *
     * @param series series Id
     *
     * @return series label (sort)
     */
    getSeriesLabel(series) {
        return this.nipixStatic.data.regionen[series]['name'] +
            ' (' +
            this.nipixStatic.data.regionen[series]['short'] +
            ')';
    }

    /**
     * Get custom color
     *
     * @param name draw name
     *
     * @return color Color
     */
    getCustomColor(name) {
        const draw = this.nipixRuntime.getDrawPreset(name);

        if (draw && draw['colors'].length > 0) {
            return ImmobilienHelper.convertColor(draw['colors']);
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
            for (let d = 0; d < this.nipixRuntime.drawPresets.length; d++) {
                if (this.nipixRuntime.drawPresets[d]['name'] === preset[i]) {
                    if (i >= count) {
                        this.nipixRuntime.drawPresets[d]['show'] = false;
                    } else {
                        this.nipixRuntime.drawPresets[d]['show'] = true;
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
        for (let s = 0; s < this.nipixStatic.data.selections.length; s++) {
            if (this.nipixStatic.data.selections[s]['name'] === selectname) {
                this.nipixStatic.data.selections[s]['selected'] = count;

                if (count > this.nipixStatic.data.selections[s]['preset'].length) {
                    count = this.nipixStatic.data.selections[s]['preset'].length;
                }

                this.onSetSpecificDraw(this.nipixStatic.data.selections[s]['preset'], count);

                this.updateChart();
                return;
            }
        }
    }

    /**
     * Toggle the NiPix Category (Eigenheime/Eigentumswohnungen) for a specific draw object.
     *
     * @param drawname Name of the draw object.
     */
    toggleNipixCategory(drawname) {
        this.nipixRuntime.toggleNipixCategory(drawname);
        this.updateChart();
    }

    /**
     * Highlight one Series (while mouse over)
     *
     * @param seriesName name of the series to highlight
     */
    highlightSeries(seriesName) {
        this.nipixRuntime.highlightSeries(seriesName);
    }

    /**
     * Reset the highlighted Map (before) timeout
     */
    resetHighlight() {
        this.nipixRuntime.resetHighlight();
    }

    /**
     * Check Static Expand
     *
     * @param id id of the tab
     */
    staticExpand(id) {
        return this.accordionComponent.isExpanded('static-' + id);
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
