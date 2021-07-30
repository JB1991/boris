import { Component, OnInit, OnDestroy, AfterViewInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { Location, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

import { ImmobilienChartOptions } from './immobilien.chartoptions';
import { ImmobilienHelper } from './immobilien.helper';
import { ImmobilienUtils } from './immobilien.utils';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilenNipixRuntime from './immobilien.runtime';

import * as echarts from 'echarts';
import { SEOService } from '@app/shared/seo/seo.service';

declare const require: any;

/* eslint-disable max-lines */
@Component({
    selector: 'power-immobilien',
    templateUrl: './immobilien.component.html',
    styleUrls: ['./immobilien.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImmobilienComponent implements OnDestroy, AfterViewInit {

    // echarts Components
    @ViewChild('echartsMap') echartsMap: ElementRef;
    @ViewChild('echartsChart') echartsChart: ElementRef;

    // Config URl
    configUrl = 'assets/data/cfg.json';

    // Nipix Static Data
    nipixStatic = new ImmobilenNipixStatic.NipixStatic();

    // Nipix Runtime Data
    nipixRuntime = new ImmobilenNipixRuntime.NipixRuntime(this.nipixStatic);

    // Accordion State
    accOpen = {};

    // true if is browser
    isBrowser = true;

    // URL
    urlIndex = null;

    animationFrameID = [null, null];
    resizeSub = [null, null];

    /**
     * Constructor:
     *
     * @param http Inject HttpClient
     */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private route: ActivatedRoute,
        private location: Location,
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Immobilienpreisindex - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Zur Darstellung der Preisentwicklung von Eigenheimen und Eigentumswohnungen leitet der obere Gutachterausschuss den niedersächsischen Immobilienpreisindex (NIPIX) ab.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Immobilienpreisindex, NIPIX, Preisentwicklung, Wohnungsmarktregion, Eigenheim, Eigentumswohnung` });

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
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
        } catch (error) {
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

    ngAfterViewInit() {
        if (!this.isBrowser) {
            return;
        }

        if (this.echartsMap) {
            this.nipixRuntime.map.obj = echarts.init(this.echartsMap.nativeElement);
            this.nipixRuntime.map.obj.on('selectchanged', this.onMapSelectChange.bind(this));

            this.resizeSub[0] = new ResizeObserver(() => {
                this.animationFrameID[0] = window.requestAnimationFrame(() => this.resize(0));
            });
            this.resizeSub[0].observe(this.echartsMap.nativeElement);
        }

        if (this.echartsChart) {
            this.nipixRuntime.chart.obj = echarts.init(this.echartsChart.nativeElement);
            this.nipixRuntime.chart.obj.on('click', this.chartClicked.bind(this));
            this.nipixRuntime.chart.obj.on('datazoom', this.onDataZoom.bind(this));

            this.resizeSub[1] = new ResizeObserver(() => {
                this.animationFrameID[1] = window.requestAnimationFrame(() => this.resize(1));
            });
            this.resizeSub[1].observe(this.echartsChart.nativeElement);
        }

        this.initNipix();
    }

    resize(itm) {
        switch (itm) {
            case 0: this.nipixRuntime.map.obj.resize(); break;
            case 1: this.nipixRuntime.chart.obj.resize(); break;
        }
    }

    ngOnDestroy() {
        if (this.resizeSub[0] && this.echartsMap) {
            this.resizeSub[0].unobserve(this.echartsMap.nativeElement);
            window.cancelAnimationFrame(this.animationFrameID[0]);
        }

        if (this.resizeSub[1] && this.echartsChart) {
            this.resizeSub[1].unobserve(this.echartsChart.nativeElement);
            window.cancelAnimationFrame(this.animationFrameID[1]);
        }
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
                this.loadGemeinden(json['gemeindenUrl']);
                this.loadGeoMap(environment.baseurl + json['mapUrl']);
                this.cdr.detectChanges();
            });
    }

    /**
     * Handle Load Gemeinden
     *
     * Format CSV; Seperator: Semikolon;
     * Fields: AGS, Geme_Bezeichnung, WOMA_ID
     *
     * @param {string} url Url to Gemeinnde CSV
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
     * parseURLTimeRange
     * @param params
     */
    parseURLTimeRange(params) {
        if (params['t1']) {
            this.nipixRuntime.state.rangeStartIndex = this.nipixRuntime.availableQuartal.indexOf(params['t1']);
        }

        if (params['t2']) {
            this.nipixRuntime.state.rangeEndIndex = this.nipixRuntime.availableQuartal.indexOf(params['t2']);
        }

        // Update Range
        if (this.nipixRuntime.state.rangeStartIndex &&
            this.nipixRuntime.state.rangeEndIndex) {
            this.nipixStatic.referenceDate =
                this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeStartIndex].replace('/', '_');
            this.chart_range['data'][2] = [
                this.nipixRuntime.state.rangeStartIndex * 100 / (this.nipixRuntime.availableQuartal.length - 1),
                -1
            ];
            this.chart_range['data'][3] = [
                this.nipixRuntime.state.rangeEndIndex * 100 / (this.nipixRuntime.availableQuartal.length - 1),
                -1
            ];
        }
    }

    /**
     * parseURLAggr
     * @param selectionId
     * @param params
     */
    parseURLAggr(selectionId, params) {

        const prelist = params['a'].split(',');
        const itm = this.nipixStatic.data.selections[selectionId];

        let ncat = null;
        if (itm['type'] === 'multiIndex' && params['i']) {
            ncat = this.checkURLNipixCategory(params['i']);
        }

        for (let i = 0; i < itm['preset'].length; i++) {
            const di = this.nipixRuntime.getDrawPreset(itm['preset'][i]);

            if (ncat !== null) {
                di.nipixCategory = ncat;
            }

            if (prelist.includes(itm['preset'][i])) {
                di.show = true;
                di.fromurl = false;
            } else {
                di.show = false;
                di.fromurl = true;
            }
        }
    }

    /**
     * parseURLSingle
     * @param selectionId
     * @param params
     */
    parseURLSingle(selectionId, params) {

        const list = params['s'].split(',');

        const val = this.unmakeValuesHumanReadable(list);

        const itm = this.nipixStatic.data.selections[selectionId];
        const preset = this.nipixRuntime.getDrawPreset(itm['preset'][0]);

        if (preset && preset['type'] === 'single') {
            preset['values'] = val;
            if (params['i']) {
                preset['nipixCategory'] = this.checkURLNipixCategory(params['i']);
            }
        }
    }

    /**
     * parse URLMultiSelect
     * @param selectionId
     * @param params
     */
    parseURLMultiSelect(selectionId, params) {

        const inp = params['m'].split(';');

        const itm = this.nipixStatic.data.selections[selectionId];

        const itmpreset = JSON.parse(JSON.stringify(itm['preset']));

        for (let i = 0; i < inp.length; i++) {
            const vgl = inp[i].split(':');

            if (itmpreset.includes(vgl[0])) {
                const di = this.nipixRuntime.getDrawPreset(vgl[0]);
                itmpreset[itmpreset.indexOf(vgl[0])] = null;
                di.show = true;
                di.values = this.unmakeValuesHumanReadable(vgl[2]);
                di.nipixCategory = this.checkURLNipixCategory(vgl[1]);
            }
        }
        let count = 0;
        for (let i = 0; i < itmpreset.length; i++) {
            if (itmpreset[i]) {
                const di = this.nipixRuntime.getDrawPreset(itmpreset[i]);
                di.show = false;
            } else {
                count = i;
            }
        }
        itm['selected'] = count + 1;
    }

    /**
     * Query URL Params
     * @param params
     */
    queryURL(params) {

        this.parseURLTimeRange(params);

        let selectionId = 0; // Default ID: 0
        if (params['c']) {
            for (let i = 0; i < this.nipixStatic.data.selections.length; i++) {
                const item = this.nipixStatic.data.selections[i];
                const eqName = item.name.replace(/[^a-zA-Z0-9]/g, '');
                if (eqName === params['c']) {
                    selectionId = i;
                    break;
                }
            }
        }
        this.nipixRuntime.state.activeSelection = selectionId;

        if (params['c']) {
            if (params['a']) { // Aggr
                this.parseURLAggr(selectionId, params);
            } else if (params['s']) { // Single
                this.parseURLSingle(selectionId, params);
            } else if (params['m']) { // MultiSelect
                this.parseURLMultiSelect(selectionId, params);
            }
        }
        /* eslint-disable-next-line scanjs-rules/call_setTimeout */
        setTimeout(this.staticChange.bind(this), 50, selectionId, true);

        this.cdr.detectChanges();

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
                    // Update available quartal
                    this.nipixRuntime.updateAvailableQuartal(geoMap['la'][0], geoMap['la'][1]);

                    this.nipixRuntime.chart.options = ImmobilienChartOptions.getChartOptions.bind(this)({
                        'text': this.nipixStatic.textOptions,
                        'date': this.nipixRuntime.availableQuartal,
                        'tooltipFormatter': this.nipixRuntime.formatter.chartTooltipFormatter,
                        'exportAsImage': function () { this.nipixRuntime.export.exportAsImage(); }.bind(this),
                        'exportCSV': function () { this.nipixRuntime.export.exportNiPixGeoJson(false); }.bind(this),
                        'exportNiPixGeoJson': function () { this.nipixRuntime.export.exportNiPixGeoJson(true); }.bind(this)
                    });

                    this.nipixRuntime.resetDrawPresets();
                    this.nipixRuntime.calculated.mapRegionen = ImmobilienUtils.getMyMapRegionen(
                        this.nipixStatic.data.regionen,
                        null,
                        null,
                        true
                    );
                    this.nipixRuntime.updateAvailableNipixCategories();
                    // setTimeout(this.staticChange.bind(this), 50, 0, true);

                    // register map:
                    echarts.registerMap('NDS', geoMap['map']);

                    // initState
                    this.nipixRuntime.state.initState++;

                    this.setMapOptions();



                    this.route.queryParams.subscribe(this.queryURL.bind(this));

                    this.cdr.detectChanges();
                });

    }


    /**
     * Set Map Options
     * @param selectType
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
        this.nipixRuntime.state.mapWidth = 10000;

        this.nipixRuntime.map.obj.setOption(this.nipixRuntime.map.options);

        // Update Map Selection; Wait a little time for browser to render
        /* eslint-disable-next-line scanjs-rules/call_setTimeout */
        setTimeout(this.updateMapSelect.bind(this), 100);

    }

    /**
     * Handle the Change of an Selection in the Map
     */
    /* eslint-disable-next-line complexity */
    onMapSelectChange(param) {
        if (param.isFromClick === false) {
            return;
        }
        console.log('select', param);
        const sdata = this.nipixRuntime.map.options.series[0]['data'];
        const selectedlist = [];
        if (param['type'] === 'selectchanged' &&
            (param['fromAction'] === 'select' ||
             param['fromAction'] === 'unselect') &&
                 param['selected'].length === 1) {

            param['selected'][0]['dataIndex'].forEach(function(index) {
                selectedlist.push(sdata[index]['name']);
            });
        }

        const nval = selectedlist;

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
     * @param category
     * @param name
     * @param typ
     */
    toggleMapSelect(category, name, typ = 'undefined') {
        console.log('toggle', category, name, typ);
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
     * @param id
     */
    updateMapSelect(id = null) {
        this.nipixRuntime.updateMapSelect(id);
    }


    /**
     * Gets chart element for map
     * @param ec
     */
    onChartInit(ec) {
        this.nipixRuntime.map.obj = ec;

        if (this.nipixRuntime.state.initState === 3) {
            this.updateMapSelect();
        }
    }

    /**
     * Gets chart element for Chart
     * @param ec
     */
    onChartChartInit(ec) {
        this.nipixRuntime.chart.obj = ec;

        if (this.nipixRuntime.state.initState === 3) {
            this.updateChart();
        }
    }

    /**
     * Finish Randering
     * @param ec
     */
    onChartFinished(ec) {
        this.nipixRuntime.export.chartRenderFinished();

        if (this.nipixRuntime.map.obj === null) {
            return;
        }

        const width = this.nipixRuntime.map.obj.getWidth();
        if ((width < 400) &&
            (this.nipixRuntime.state.mapWidth >= 400)) {
            this.nipixRuntime.state.mapWidth = width;
            this.nipixRuntime.map.obj.setOption({
                'title': {
                    'text': $localize`Wohnungsmarktregionen\nin Niedersachsen`
                }
            });
        }

        if ((width >= 400) &&
            (this.nipixRuntime.state.mapWidth < 400)) {
            this.nipixRuntime.state.mapWidth = width;
            this.nipixRuntime.map.obj.setOption({
                'title': {
                    'text': $localize`Wohnungsmarktregionen in Niedersachsen`
                }
            });
        }

    }

    /**
     * Change between NiPix Category (Eigenheime, Wohnungen)
     * @param index
     * @param cat
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
     * @param start
     * @param end
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
     * @param name
     */
    onClickDrawRoot(name) {
        // this.selectedTreeItem = name;
        this.updateMapSelect();
        this.updateChart();
    }

    /**
     * Toggle Show of Draw Item
     * @param name
     */
    onToggleDrawRoot(name) {
        for (let i = 0; i < this.nipixRuntime.drawPresets.length; i++) {
            if (this.nipixRuntime.drawPresets[i].name === name) {
                this.nipixRuntime.drawPresets[i].show = !this.nipixRuntime.drawPresets[i].show;
                if (this.nipixRuntime.drawPresets[i].fromurl) {
                    delete (this.nipixRuntime.drawPresets[i].fromurl);
                }
            }
        }
        this.updateChart();
    }

    /**
     * Update Chart
     * @param start
     * @param end
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
        this.changeURL();

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
     * @param range_start
     * @param range_end
     * @param subAdd
     * @param range_text
     */
    updateChartMerge(range_start, range_end, subAdd, range_text) {
        const chartOptionMerge = ImmobilienChartOptions.getChartOptionsMerge({
            'text': this.nipixStatic.textOptions,
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
        (chartOptionMerge.series as any).push(this.chart_range);

        // Set Options to chart
        if (this.nipixRuntime.chart.obj !== null) {
            this.nipixRuntime.chart.obj.setOption(
                Object.assign(this.nipixRuntime.chart.options, chartOptionMerge),
                true,
                false
            );
        }

    }

    /**
     * Handle Chart DataZoom
     * @param event
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
     * @param event
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
        this.urlIndex = selection_id;
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
     * @param id
     * @returns WoMaReg Name
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
     * @returns color Color
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
                    if (!this.nipixRuntime.drawPresets[d]['fromurl']) {
                        if (i >= count) {
                            this.nipixRuntime.drawPresets[d]['show'] = false;
                        } else {
                            this.nipixRuntime.drawPresets[d]['show'] = true;
                        }
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
     * @returns True if expanded
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

        this.cdr.detectChanges();

    }

    makeValuesHumanReadable(values) {
        const val = [];
        for (let i = 0; i < values.length; i++) {
            val.push(this.nipixStatic.data.regionen[values[i]]['short'].replace(/[^a-zA-Z0-9]/g, ''));
        }
        return val;
    }

    unmakeValuesHumanReadable(list) {
        const val = [];
        const reg = Object.keys(this.nipixStatic.data.regionen);
        for (let i = 0; i < reg.length; i++) {
            if (list.includes(this.nipixStatic.data.regionen[reg[i]]['short'].replace(/[^a-zA-Z0-9]/g, ''))) {
                val.push(reg[i]);
            }
        }
        return val;
    }

    checkURLNipixCategory(ncat) {
        let val = this.nipixRuntime.availableNipixCategories[0];
        for (let i = 0; i < this.nipixRuntime.availableNipixCategories.length; i++) {
            if (this.nipixRuntime.availableNipixCategories[i].replace(/[^a-zA-Z0-9]/g, '') === ncat) {
                val = this.nipixRuntime.availableNipixCategories[i];
            }
        }
        return val;
    }

    changeURLAppendPresets(selection, params) {

        const presetName = selection['preset'];

        if (presetName.length === 1) {
            const preset = this.nipixRuntime.getDrawPreset(presetName[0]);
            if (preset['type'] === 'single') {
                params.append('i', preset['nipixCategory'].replace(/[^a-zA-Z0-9]/g, ''));
                params.append('s', this.makeValuesHumanReadable(preset['values']).join(','));
            }
        } else {
            const preset = this.nipixRuntime.getDrawPreset(presetName[0]);
            if (preset.name.length > 3) {
                if (selection['type'] === 'multiIndex') {
                    params.append('i', preset['nipixCategory'].replace(/[^a-zA-Z]/g, ''));
                }
                const pre = [];
                for (let i = 0; i < presetName.length; i++) {
                    if (this.nipixRuntime.getDrawPreset(presetName[i]).show) {
                        pre.push(presetName[i]);
                    }
                }
                params.append('a', pre.join(','));

            } else { // Sonderfall manueller Vergleich
                const pval = [];
                for (let i = 0; i < presetName.length; i++) {
                    const spreset = this.nipixRuntime.getDrawPreset(presetName[i]);
                    if (spreset['values'].length > 0) {
                        pval.push(
                            presetName[i].replace(/[^a-zA-Z0-9]/g, '') + ':' +
                            spreset['nipixCategory'].replace(/[^a-zA-Z0-9]/g, '') + ':' +
                            this.makeValuesHumanReadable(spreset['values']).join(',')
                        );
                    }
                }
                if (pval.length > 0) {
                    params.append('m', pval.join(';'));
                }
            }
        }
    }

    changeURL() {
        const params = new URLSearchParams({});

        params.append(
            't1',
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeStartIndex]
        );

        params.append(
            't2',
            this.nipixRuntime.availableQuartal[this.nipixRuntime.state.rangeEndIndex]
        );

        if (this.urlIndex !== null) {
            params.append(
                'c',
                this.nipixStatic.data.selections[this.urlIndex].name.replace(/[^a-zA-Z0-9]/g, '')
            );
        }
        const selection = this.nipixStatic.data.selections[this.urlIndex];
        if (selection !== undefined) {
            this.changeURLAppendPresets(selection, params);
        }

        this.location.replaceState('/immobilienpreisindex', params.toString());
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
