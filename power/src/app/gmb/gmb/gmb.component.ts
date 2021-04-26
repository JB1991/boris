import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import * as echarts from 'echarts';
import * as data from './gmb.json';
import * as kreise_raw from './kreise.json';

/* eslint-disable max-lines */
@Component({
    selector: 'power-gmb',
    templateUrl: './gmb.component.html',
    styleUrls: ['./gmb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GmbComponent implements OnInit {
    downloadPath = '/download';
    berichte = data['default'];
    kreise = kreise_raw['default'];

    mode = undefined;

    map = {};
    mapLoaded = false;
    mapOptions = {};

    selectedKreis = undefined;
    berichteFiltered = [];
    berichteOpened = [];
    isBrowser = true;

    /**
     * MapOptions
     */
    myMapOptions = {
        'title': {
            'text': $localize`Landkreise in Niedersachsen*`,
            'left': 'center',
            'top': 10,
            'textStyle': { fontSize: this.convertRemToPixels(1) }
        },
        graphic: [
            {
                type: 'text',
                id: 'copyright',
                left: 10,
                bottom: 10,
                z: 100,
                style: {
                    fill: '#333',
                    textAlign: 'left',
                    fontSize: this.convertRemToPixels(0.8),
                    text: $localize`Quelle: Oberer Gutachterausschuss für \nGrundstückswerte in Niedersachsen, 2021`
                }
            }
        ],

        'tooltip': {
            'trigger': 'item',
            'showDelay': 0,
            'transitionDuration': 0.2,
            'formatter': function (params) {
                if (this.kreise.hasOwnProperty(params.name)) {
                    return this.kreise[params.name];
                } else {
                    return params.name;
                }
            }.bind(this),
            'textStyle': { 'fontSize': this.convertRemToPixels(1) }
        },
        'geo': {
            'map': 'NDS',
            'roam': false,
            'aspectScale': 1,
            'show': false
        },
        'series': [
            {
                'name': $localize`Landkreise in Niedersachsen`,
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
                'selectedMode': 'single',
                'data': this.getRegionen(),
            }
        ],
        'color': ['#000000']
    };

    /**
     * Constructor:
     *
     * @param http Inject HttpClient
     * @param titleService Service for settings the title of the HTML document
     */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private http: HttpClient,
        private titleService: Title,
        private meta: Meta,
        private route: ActivatedRoute,
        private location: Location,
        private cdr: ChangeDetectorRef
    ) {
        this.changeTitle();

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
    }

    changeTitle() {
        if (this.mode === 'gmb') {
            this.titleService.setTitle($localize`Grundstücksmarktberichte - Immobilienmarkt.NI`);
            this.meta.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf die Grundstücksmarktberichte der Landkreise von Niedersachsen` });
            this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Grundstücksmarktberichte, Landkreis` });
        } else if (this.mode === 'lmb') {
            this.titleService.setTitle($localize`Landesgrundstücksmarktberichte - Immobilienmarkt.NI`);
            this.meta.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf die Landesgrundstücksmarktberichte von Niedersachsen` });
            this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Landesgrundstücksmarktberichte` });
        }
    }

    /**
     * OnInit
     * Load geojson for Landkreise
     */
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.mapInit();
        }

        this.route.data.subscribe(routedata => {
            if (routedata['mode'] === 'lmb') {
                this.mode = 'lmb';
                this.filterBerichte(true);
            }
            if (routedata['mode'] === 'gmb') {
                this.mode = 'gmb';
            }
            this.changeTitle();
            this.cdr.detectChanges();

        });

        this.route.queryParams.subscribe(params => {
            if (this.mode === 'gmb') {
                if (params['landkreis']) {
                    this.mode = 'gmb';
                    const lk = params['landkreis'];
                    const lok = Object.keys(this.kreise);
                    for (let i = 0; i < lok.length; i++) {
                        if (this.kreise[lok[i]] === lk) {
                            this.selectedKreis = lok[i];
                            this.filterBerichte();
                            this.myMapOptions['series'][0]['data'] = this.getRegionen();
                            if (this.map['setOptions'] !== undefined) {
                                this.map['setOptions'](this.myMapOptions);
                            }
                            i = lok.length;
                        }
                    }
                }
            }
            if (params['berichte']) {
                const berichte = params['berichte'].split(',');
                this.berichteOpened = berichte;
            }

            this.cdr.detectChanges();

        });

    }

    mapInit() {
        this.loadGeoMap('assets/gmb.geojson');
    }

    /**
     * Gets chart element for map
     */
    onChartInit(ec) {
        this.map = ec;

        if (this.selectedKreis !== undefined) {
            this.updateMapSelect();
        }
    }

    /**
     * Load Map
     *
     * @param {string} url Url to Map GeoJSON
     */
    loadGeoMap(url) {
        this.http.get(url)
            .subscribe(
                geoJson => {
                    this.mapLoaded = true;

                    echarts.registerMap('NDS', geoJson);
                    this.mapOptions = this.myMapOptions;

                    this.cdr.detectChanges();
                }
            );
    }

    /**
     * Generate Map Regionen
     */
    getRegionen() {
        const res = [];
        const keys = Object.keys(kreise_raw['default']);

        for (let i = 0; i < keys.length; i++) {
            const region = {
                'name': keys[i],
                'itemStyle': {
                    'areaColor': '#dee2e6'
                    /* "borderColor": bc,
                "borderWidth": bw */
                },
                'emphasis': {
                    'itemStyle': {
                        'areaColor': '#c4153a' // convertColor(regionen[keys[i]].color),
                        /* "borderColor": bc,
                    "borderWidth": bw */
                    }
                }
            };
            if (this.selectedKreis === keys[i]) {
                region['selected'] = true;
            }
            res.push(region);
        }
        return res;
    }

    selectMenu() {
        const res = [];
        const ok = Object.keys(this.kreise);
        for (let i = 0; i < ok.length; i++) {
            res.push({
                'key': ok[i],
                'value': this.kreise[ok[i]]
            });
        }
        res.sort(function (a, b) {
            if (a['value'] < b['value']) { return -1; }
            if (a['value'] > b['value']) { return 1; }
            return 0;
        });

        return [{ 'key': null, 'value': '-- ' + $localize`Landkreis` + ' --' }, ...res];
    }

    /**
     * generate Kreisliste
     */
    generateKreisliste(arr) {
        if (arr === undefined) {
            return;
        }

        const res = [];

        for (let i = 0; i < arr.length; i++) {
            if (this.kreise.hasOwnProperty(arr[i])) {
                res.push(this.kreise[arr[i]]);
            } else {
                res.push(arr[i]);
            }
        }
        return res.join('; ');
    }

    filterBerichteGMB() {
        const bf = [];
        const ber = Object.keys(this.berichte);
        for (let i = 0; i < ber.length; i++) {
            const yr = [];
            const yk = Object.keys(this.berichte[ber[i]]);
            for (let y = 0; y < yk.length; y++) {
                if ((this.berichte[ber[i]][yk[y]]['bereich'] !== undefined) &&
                    (this.berichte[ber[i]][yk[y]]['bereich'].includes(this.selectedKreis))) {
                    yr.push({
                        'key': yk[y],
                        'value': this.berichte[ber[i]][yk[y]]
                    });
                }
            }

            if (yr.length > 0) {
                yr.sort(function (b, a) {
                    return a['key'] - b['key'];
                });

                bf.push({
                    'name': ber[i],
                    'berichte': yr,
                    'start': yr[yr.length - 1]['key']
                });
            }
        }

        bf.sort(function (b, a) {
            return a['start'] - b['start'];
        });

        return bf;
    }

    filterBerichteLMB() {

        const bf = [];
        const bb = [];
        const yk = Object.keys(this.berichte['Niedersachsen']);

        for (let y = 0; y < yk.length; y++) {
            bb.push({
                'key': yk[y],
                'value': this.berichte['Niedersachsen'][yk[y]]
            });

        }

        bb.sort(function (b, a) {
            return a['key'] - b['key'];
        });

        bf.push({
            'name': 'Niedersachsen',
            'berichte': bb
        });

        return bf;
    }

    /**
     * Filter Berichte based on selection
     */
    filterBerichte(lmb = false) {
        if (this.selectedKreis === undefined && !lmb) {
            this.berichteFiltered = [];
            return;
        }

        if (!lmb) {
            this.berichteFiltered = this.filterBerichteGMB();
        } else {
            this.berichteFiltered = this.filterBerichteLMB();
        }
    }


    /**
     * Handle the Change of an Selection in the Map
     */
    onMapSelectChange(param) {

        let selectedlist = null;
        if ((param['type'] === 'mapselectchanged') &&
            (param['batch'] !== undefined) &&
            (param['batch'] !== null)) {
            selectedlist = param['batch'][0]['selected'];
        } else {
            selectedlist = param['selected'];
        }

        const ok = Object.keys(selectedlist);

        for (let i = 0; i < ok.length; i++) {
            if (selectedlist[ok[i]] === true) {
                this.selectedKreis = ok[i];
                this.berichteOpened = [];
                this.filterBerichte();
                this.changeURL();
                return;
            }
        }

        this.selectedKreis = undefined;
        this.berichteOpened = [];
        this.filterBerichte();
        this.changeURL();
    }

    private updateMapSelect() {
        if (this.map['dispatchAction'] !== undefined) {
            this.map['dispatchAction']({
                type: 'mapSelect',
                name: this.selectedKreis
            });
        }
    }
    /**
     * Handle Landkreis Select change
     *
     * @param newValue New selected Landkreis
     */
    onChange(newValue) {
        if (newValue === null) {
            this.selectedKreis = undefined;
        } else {
            this.selectedKreis = newValue;
        }
        this.berichteOpened = [];
        this.changeURL();
        this.updateMapSelect();
        this.filterBerichte();
    }

    keyPress(event: any) {
        if (event.key === 'Enter') {
            event.target['checked'] = !event.target['checked'];
        }
    }

    checkValue(event: any) {
        if (event.target['checked'] === true) {
            this.berichteOpened.push(event.target['id'].substring(2));
        } else {
            const index = this.berichteOpened.indexOf(event.target['id'].substring(2));
            if (index > -1) {
                this.berichteOpened.splice(index, 1);
            }
        }
        this.changeURL();
    }

    changeURL() {
        const params = new URLSearchParams({});
        if (this.mode === 'gmb' && this.selectedKreis) {
            params.append('landkreis', this.kreise[this.selectedKreis]);
        }
        if (this.berichteOpened.length > 0) {
            params.append('berichte', this.berichteOpened.join(','));
        }
        if (this.mode === 'gmb') {
            this.location.replaceState('/grundstuecksmarktberichte', params.toString());
        }
        if (this.mode === 'lmb') {
            this.location.replaceState('/landesgrundstuecksmarktberichte', params.toString());
        }
    }

    ariaLabelBericht(year, rd, dl = false) {
        let label = '';

        if (dl) {
            label += $localize`Download des` + ' ';


            if (rd === 'Niedersachsen') {
                label += $localize`Landesgrundstücksmarktberichtes`;
            } else {
                label += $localize`Grundstücksmarktberichtes`;
            }
        } else {
            if (rd === 'Niedersachsen') {
                label += $localize`Landesgrundstücksmarktbericht`;
            } else {
                label += $localize`Grundstücksmarktbericht`;
            }

        }
        label += ' ' + year;

        if (rd !== 'Niedersachsen') {
            label += ' ' + $localize`vom Gutachterausschuss` + ' ' + rd;
        }

        return label;
    }

    /**
     * Convert REM to PX
     * source: https://stackoverflow.com/a/42769683
     *
     * @param rem size in rem
     *
     * @return size in px
     */
    convertRemToPixels(rem: number): number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
