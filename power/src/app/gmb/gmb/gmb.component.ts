import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import * as echarts from 'echarts';
import * as data from './gmb.json';
import * as kreise_raw from './kreise.json';

/* eslint-disable max-lines */
@Component({
    selector: 'power-gmb',
    templateUrl: './gmb.component.html',
    styleUrls: ['./gmb.component.scss']
})
export class GmbComponent implements OnInit {
    downloadPath = 'http://localhost/';
    berichte = data['default'];
    kreise = kreise_raw['default'];

    mode = undefined;

    map = {};
    mapLoaded = false;
    mapOptions = {};

    selectedKreis = undefined;
    berichteFiltered = [];

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
                left: 90,
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
        private http: HttpClient,
        private titleService: Title,
        private route: ActivatedRoute,
        private location: Location,
        private cdr: ChangeDetectorRef
    ) {
        this.changeTitle();
    }

    changeTitle() {
        if (this.mode === 'gmb') {
            this.titleService.setTitle($localize`Grundstücksmarktberichte (Archiv)`);
        } else if (this.mode === 'lmb') {
            this.titleService.setTitle($localize`Landesgrundstücksmarktberichte (Archiv)`);
        }
    }
    /**
     * OnInit
     * Load geojson for Landkreise
     */
    ngOnInit(): void {
        this.mapInit();
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
    }

    mapInit() {
        this.loadGeoMap('assets/gmb.geojson');
    }

    /**
     * Gets chart element for map
     */
    onChartInit(ec) {
        this.map = ec;
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
        res.sort(function(a, b) {
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

    /**
     * Filter Berichte based on selection
     */
    filterBerichte(lmb = false) {
        if (this.selectedKreis === undefined && !lmb) {
            this.berichteFiltered = [];
            return;
        }

        const bf = [];

        if (!lmb) {
            const ber = Object.keys(this.berichte);
            for (let i = 0; i < ber.length; i++) {
                const yr = {};
                const yk = Object.keys(this.berichte[ber[i]]);
                for (let y = 0; y < yk.length; y++) {
                    if ((this.berichte[ber[i]][yk[y]]['bereich'] !== undefined) &&
                        (this.berichte[ber[i]][yk[y]]['bereich'].includes(this.selectedKreis))) {
                        yr[yk[y]] = this.berichte[ber[i]][yk[y]];
                    }
                }

                const yl = Object.keys(yr);
                if (yl.length > 0) {
                    bf.push({
                        'name': ber[i],
                        'berichte': yr,
                        'start': yl[0]
                    });
                }
            }

            bf.sort(function(a, b) {
                return a['start'] - b['start'];
            });
        }

        if (lmb) {
            bf.push({
                'name': 'Niedersachsen',
                'berichte': this.berichte['Niedersachsen']
            });
        }

        this.berichteFiltered = bf;
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
                this.filterBerichte();
                return;
            }
        }
    }

    /**
     * Handle Landkreis Select change
     *
     * @param newValue New selected Landkreis
     */
    onChange(newValue) {
        this.selectedKreis = newValue;

        if (this.map['dispatchAction'] !== undefined) {
            this.map['dispatchAction']({
                type: 'mapSelect',
                name: this.selectedKreis
            });
        }
        this.filterBerichte();
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
