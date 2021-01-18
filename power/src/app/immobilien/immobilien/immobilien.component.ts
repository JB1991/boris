import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { ImmobilienChartOptions } from './immobilien.chartoptions';
import { ImmobilienHelper } from './immobilien.helper';
import { ImmobilienUtils } from './immobilien.utils';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilenNipixRuntime from './immobilien.runtime';

import * as echarts from 'echarts';

declare const require: any;

/* eslint-disable max-lines */
@Component({
    selector: 'power-immobilien',
    templateUrl: './immobilien.component.html',
    styleUrls: ['./immobilien.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImmobilienComponent implements OnInit {

    // Config URl
    configUrl = 'assets/data/cfg.json';

    // Nipix Static Data
    nipixStatic = new ImmobilenNipixStatic.NipixStatic();

    // Nipix Runtime Data
    nipixRuntime = new ImmobilenNipixRuntime.NipixRuntime(this.nipixStatic);

    // Accordion State
    accOpen = {};

    /**
     * Constructor:
     *
     * @param http Inject HttpClient
     * @param titleService Service for settings the title of the HTML document
     */
    constructor(
        private http: HttpClient,
        private titleService: Title,
        private cdr: ChangeDetectorRef
    ) {
        this.titleService.setTitle($localize`Immobilienpreisindex - POWER.NI`);
    }

    title = 'lgln';

    // show loading spinner:
    mapLoaded = false;

    // Wohnungsmartregion suchen
    selectedWoMa: string;
    selectedWoMaValue: string;

    selectSingle() {
        let singleSelectionId = null;
        for (let i = 0; i < this.nipixStatic.data.selections.length; i++) {
            if (this.nipixStatic.data.selections[i]['type'] === 'single') {
                singleSelectionId = i;
            }
        }

        return singleSelectionId;
    }

    onSelectWoMa(): void {
        try {
            this.selectedWoMa = this.nipixStatic.data.gemeinden.filter(p => p.name === this.selectedWoMaValue)[0];
        } catch(error) {
            this.selectedWoMa = '';
            return;
        }

        const singleSelectionId = this.selectSingle();

        const accKeys = Object.keys(this.accOpen);
        let isSet = false;
        if (singleSelectionId !== null) {
            for (let i = 0; i < accKeys.length; i++) {
                if (parseInt(accKeys[i], 10) < 90) {
                    if (accKeys[i] === singleSelectionId) {
                        this.accOpen[accKeys[i]] = true;
                        isSet = true;
                    } else {
                        this.accOpen[accKeys[i]] = false;
                    }
                }
            }
        }

        if (!isSet) {
            this.accOpen[singleSelectionId] = true;
        }
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i]['name'] === this.nipixStatic.data.selections[singleSelectionId]['preset'][0]) {
                this.nipixRuntime.drawPresets[i].values = [this.selectedWoMa['woma_id']];
            }
        }
        this.nipixRuntime.state.activeSelection = singleSelectionId;
        this.updateMapSelect();
        this.updateChart();
    }

    /**
     * echart_range_series
     */
    chart_range = ImmobilienChartOptions.chartRange();

    /**
     * Init the Application.
     */
    ngOnInit() {
        this.initNipix();
    }

    /**
     * Init the Application.
     * Load external Config File
     */
    initNipix() {
        // Load Config
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

                this.nipixRuntime.calculated.chartTitle = this.nipixStatic.data.selections[0]['name'];
                this.nipixRuntime.availableQuartal = ImmobilienUtils.getDateArray(json['lastYear'], json['lastPeriod']);
                this.nipixRuntime.updateAvailableQuartal(json['lastYear'], json['lastPeriod']);
                this.nipixRuntime.chart.options = ImmobilienChartOptions.getChartOptions.bind(this)({
                    'text': this.nipixStatic.textOptions,
                    'date': this.nipixRuntime.availableQuartal,
                    'tooltipFormatter': this.nipixRuntime.formatter.chartTooltipFormatter,
                    'exportAsImage': function () { this.nipixRuntime.export.exportAsImage(); }.bind(this),
                    'exportCSV': function () { this.nipixRuntime.export.exportNiPixGeoJson(false); }.bind(this),
                    'exportNiPixGeoJson': function () { this.nipixRuntime.export.exportNiPixGeoJson(true); }.bind(this)
                });
                this.loadGemeinden(json['gemeindenUrl']);
                this.loadGeoMap(json['mapUrl']);
                this.cdr.detectChanges();
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
        this.http.get(url, { responseType: 'text' })
            .subscribe(gem => {
                this.nipixStatic.parseGemeinden(gem);

                // InitState
                this.nipixRuntime.state.initState++;
                this.cdr.detectChanges();
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

                    const geoMap = this.nipixStatic.procMap(geoJson);

                    this.nipixRuntime.resetDrawPresets();
                    this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
                        this.nipixStatic.data.regionen,
                        null,
                        null,
                        true
                    );
                    this.nipixRuntime.updateAvailableNipixCategories();
                    setTimeout(this.staticChange.bind(this), 50, 0, true);

                    // register map:
                    echarts.registerMap('NDS', geoMap);

                    // initState
                    this.nipixRuntime.state.initState++;

                    this.setMapOptions();
                    this.cdr.detectChanges();
                });
    }


    /**
     * Set Map Options
     */
    setMapOptions(selectType: any = 'multiple') {

        this.nipixRuntime.map.options = ImmobilienChartOptions.getMapOptions.bind(this)({
            'text': this.nipixStatic.textOptions,
            'tooltipFormatter': this.nipixRuntime.formatter.mapTooltipFormatter,
            'exportGeoJSON': function () { this.nipixRuntime.export.exportGeoJSON(); }.bind(this),
            'mapRegionen': this.nipixRuntime.calculated.mapRegionen,
            'geoCoordMapLeft': this.nipixStatic.data.geoCoordMap['left'],
            'geoCoordMapRight': this.nipixStatic.data.geoCoordMap['right'],
            'geoCoordMapTop': this.nipixStatic.data.geoCoordMap['top'],
            'geoCoordMapBottom': this.nipixStatic.data.geoCoordMap['bottom']
        }, selectType);
        // Update Map Selection; Wait a little time for browser to render
        setTimeout(this.updateMapSelect.bind(this), 100);

    }

    /**
     * Handle the Change of an Selection in the Map
     */
    /* eslint-disable-next-line complexity */
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
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i].show === true) {
                if ((this.nipixRuntime.drawPresets[i].type === 'aggr') &&
                    (this.nipixRuntime.drawPresets[i].name.length > 2) &&
                    (nval.length === 0)) {
                    this.nipixRuntime.drawPresets[i].values =
                        JSON.parse(JSON.stringify(this.nipixStatic.data.presets[i].values));
                } else if ((this.nipixRuntime.drawPresets[i].type === 'aggr') &&
                    (this.nipixRuntime.drawPresets[i].name.length > 2) &&
                    (this.nipixStatic.data.presets[i].values.includes(nval[0]))) {
                    this.nipixRuntime.drawPresets[i].values = nval;
                } else if ((this.nipixRuntime.drawPresets[i].type !== 'aggr') ||
                    (this.nipixRuntime.drawPresets[i].name.length <= 2)) {
                    this.nipixRuntime.drawPresets[i].values = nval;
                }
            }
        }

        // Finally Update chart
        this.updateChart();
    }

    /**
     * Toggle the Selection of an Subitem
     */
    toggleMapSelect(category, name, typ = 'undefined') {
        this.nipixRuntime.resetHighlight();
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

        if (this.nipixRuntime.state.initState === 3) {
            this.updateMapSelect();
        }
    }

    /**
     * Gets chart element for Chart
     */
    onChartChartInit(ec) {
        this.nipixRuntime.chart.obj = ec;

        if (this.nipixRuntime.state.initState === 3) {
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
     * Manually change Quartal
     */
    onChangeQuartal(start, end) {
        if (start !== null) {
            this.nipixRuntime.state.rangeStartIndex = start;
        }

        if (end !== null) {
            this.nipixRuntime.state.rangeEndIndex = end;
        }

        this.updateChart(
            this.nipixRuntime.state.rangeStartIndex * 100 / (this.nipixRuntime.availableQuartal.length - 1),
            this.nipixRuntime.state.rangeEndIndex * 100 / (this.nipixRuntime.availableQuartal.length - 1)
        );
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

        const range_text = $localize`Zeitraum von` + ' ' +
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeStartIndex] +
            ' ' + $localize`bis` + ' ' +
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
        const chartOptionMerge = ImmobilienChartOptions.getChartOptionsMerge({
            'graphic0': this.nipixRuntime.chart.options['graphic'][0],
            'graphic1left': this.nipixStatic.chartExportWidth - 600 + 65,
            'graphic1children': [].concat(this.nipixRuntime.formatter.graphicLegend()),
            'graphic2fontsize': ImmobilienHelper.convertRemToPixels(this.nipixStatic.textOptions.fontSizePage),
            'graphic2text': range_text,
            'legenddata': this.nipixRuntime.formatter.simpleLegend(),
            'legendformatter': this.nipixRuntime.formatter.formatLegend,
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

    /* eslint-disable-next-line complexity */
    onPanelChangeIndex(selection_id: number) {
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if ((this.nipixRuntime.drawPresets[i].show) &&
                (this.nipixRuntime.drawPresets[i].type === 'aggr') &&
                (this.nipixRuntime.drawPresets[i].name.length > 3)) {
                this.nipixRuntime.drawPresets[i].values =
                    JSON.parse(JSON.stringify(this.nipixStatic.data.presets[i].values));
            }
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
            this.nipixRuntime.state.activeSelection = selection_id;
        }
        this.nipixRuntime.state.selectedChartLine = '';
        this.updateChart();
        this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
            ImmobilienUtils.modifyRegionen(this.nipixStatic.data.regionen, this.nipixRuntime.drawPresets
                .filter(drawitem => (drawitem['show'] === true && drawitem['type'] !== 'single'))),
            null, null, true);
        if ((this.nipixStatic.data.selections[selection_id]['type'] === 'single') ||
            (this.nipixStatic.data.selections[selection_id]['type'] === 'multiIndex')) {
            this.setMapOptions();
        } else if (this.nipixStatic.data.selections[selection_id]['type'] === 'multi') {
            this.setMapOptions('single');
        } else {
            this.setMapOptions(false);
        }
    }

    /**
     * Toggle All for specific draw
     *
     * @param drawname Name of the draw Object
     */
    toggleAllSelect(drawname) {
        this.nipixRuntime.resetHighlight();
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
     * Check Static Expand
     *
     * @param id id of the tab
     */
    staticExpand(id) {
        if (this.accOpen[id] === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Change Static Expand
     *
     * @param id id of the tab
     * @param event boolean is Opened
     */
    staticChange(id, event) {
        this.accOpen[id] = event;
        if ((id < 90) && (event === true)) {
            this.onPanelChangeIndex(id);
        }
        if ((id === 99) && (event === true)) {
            this.onPanelChangeWoMa();
        }

    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
