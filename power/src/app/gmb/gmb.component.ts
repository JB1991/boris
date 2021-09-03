import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { Location, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { init, registerMap, ECharts, EChartsOption, SeriesOption } from 'echarts';

import { SEOService } from '@app/shared/seo/seo.service';
import { GMB_DATA } from './gmb';
import { KREISE_DATA } from './kreise';

/* eslint-disable max-lines */
@Component({
    selector: 'power-gmb',
    templateUrl: './gmb.component.html',
    styleUrls: ['./gmb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GmbComponent implements OnInit, OnDestroy, AfterViewInit {

    // echarts Components
    @ViewChild('echartsMap') public echartsMap?: ElementRef;

    public downloadPath = '/download';
    public berichte = GMB_DATA;
    public kreise = KREISE_DATA;

    public mode?: string = undefined;

    public map?: ECharts = undefined;

    public selectedKreis?: keyof typeof KREISE_DATA = undefined;
    public berichteFiltered = new Array<any>();
    public berichteOpened = new Array<string>();
    public isBrowser = true;

    public animationFrameID?: number = undefined;
    public resizeSub?: ResizeObserver;

    /**
     * MapOptions
     */
    public myMapOptions: EChartsOption = {
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
            'formatter': function (params: any) {
                if (KREISE_DATA.hasOwnProperty(params.name)) {
                    return KREISE_DATA[params.name as keyof typeof KREISE_DATA];
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
                'map': 'NDS', // map type should be registered
                'label': {
                    'show': false
                },
                'emphasis': {
                    'label': {
                        'show': false
                    }
                },
                'selectedMode': 'single',
                'data': this.getRegionen()
            }
        ],
        'color': ['#000000']
    };

    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private http: HttpClient,
        private route: ActivatedRoute,
        private location: Location,
        private cdr: ChangeDetectorRef,
        private seo: SEOService
    ) {
        this.changeTitle();
        this.seo.addURLParameter('landkreis');

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
    }

    public changeTitle(): void {
        if (this.mode === 'gmb') {
            this.seo.setTitle($localize`Grundstücksmarktberichte - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Grundstücksmarktberichte geben einen fundierten Einblick in das Geschehen am Grundstücksmarkt, insbesondere über Umsätze, Preisentwicklungen und Preisniveau in den Teilmärkten.` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Grundstücksmarktbericht, Landkreis, Download, Grundstücksmarkt, Grundstück, Entwicklung, Umsatz, Bauland, Bodenrichtwert, Haus, Wohnung, Miete` });
        } else if (this.mode === 'lmb') {
            this.seo.setTitle($localize`Landesgrundstücksmarktberichte - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Der Landesgrundstücksmarktbericht gibt einen Überblick über Immobilienverkäufe in Niedersachsen. Er ist das Ergebnis der Auswertung sämtlicher Grundstückskaufverträge durch die Gutachterausschüsse für Grundstückswerte.` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Landesgrundstücksmarktbericht, Download, Grundstücksmarkt, Grundstück, Entwicklung, Umsatz, Bauland, Bodenrichtwert, Haus, Wohnung, Miete` });
        }
    }

    /** @inheritdoc */
    public ngAfterViewInit(): void {
        if (!this.isBrowser) {
            return;
        }

        if (this.mode === 'gmb') {
            if (this.echartsMap) {
                this.map = init(this.echartsMap.nativeElement);
                this.map.on('selectchanged', this.onMapSelectChange.bind(this));

                this.resizeSub = new ResizeObserver(() => {
                    this.animationFrameID = window.requestAnimationFrame(() => this.resize());
                });
                this.resizeSub.observe(this.echartsMap.nativeElement);
            }
            if (this.selectedKreis !== undefined) {
                this.updateMapSelect();
            }
        }

        this.route.queryParams.subscribe(params => {
            if (this.mode === 'gmb') {
                if (params['landkreis']) {
                    this.mode = 'gmb';
                    const lk = params['landkreis'];
                    const lok = Object.keys(KREISE_DATA);
                    for (let i = 0; i < lok.length; i++) {
                        if (KREISE_DATA.hasOwnProperty(lok[i])
                            && KREISE_DATA[lok[i] as keyof typeof KREISE_DATA] === lk) {
                            this.selectedKreis = lok[i] as keyof typeof KREISE_DATA;
                            this.updateMapSelect();
                            this.filterBerichte();
                            (this.myMapOptions['series'] as SeriesOption[])[0]['data'] = this.getRegionen();
                            if (this.map?.setOption !== undefined) {
                                this.map.setOption(this.myMapOptions);
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

    /**
     * Resizes echart
     */
    public resize(): void {
        this.map?.resize();
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        if (this.resizeSub) {
            this.resizeSub.disconnect();
            if (this.animationFrameID) {
                window.cancelAnimationFrame(this.animationFrameID);
            }
        }
    }

    /** @inheritdoc */
    public ngOnInit(): void {
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
    }

    public mapInit(): void {
        this.loadGeoMap('assets/gmb.geojson');
    }

    /**
     * Load Map
     *
     * @param {string} url Url to Map GeoJSON
     */
    public loadGeoMap(url: string): void {
        this.http.get(url)
            .subscribe(
                geoJson => {
                    registerMap('NDS', geoJson as any);
                    if (this.map) {
                        this.map.setOption(this.myMapOptions);
                    }

                    this.cdr.detectChanges();
                }
            );
    }

    /**
     * Generate Map Regionen
     * @returns Array of regions
     */
    public getRegionen(): any[] {
        const res = new Array<any>();
        const keys = Object.keys(KREISE_DATA);

        for (let i = 0; i < keys.length; i++) {
            const region = {
                'name': keys[i],
                'itemStyle': {
                    'areaColor': '#dee2e6'
                },
                'emphasis': {
                    'itemStyle': {
                        'areaColor': '#c4153a' // convertColor(regionen[keys[i]].color),
                    }
                },
                'select': {
                    'itemStyle': {
                        'areaColor': '#c4153a'
                    },
                    'label': {
                        'show': false
                    }
                },
                'selected': false
            };
            if (this.selectedKreis === keys[i]) {
                region['selected'] = true;
            }
            res.push(region);
        }
        return res;
    }

    public selectMenu(): any[] {
        const res = new Array<any>();
        const ok = Object.keys(KREISE_DATA);
        for (let i = 0; i < ok.length; i++) {
            res.push({
                'key': ok[i],
                'value': KREISE_DATA[ok[i] as keyof typeof KREISE_DATA]
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
     * @param arr Array
     * @returns Kreisliste
     */
    public generateKreisliste(arr: string[]): string {
        if (!arr) {
            return '';
        }

        const res = new Array<any>();

        for (let i = 0; i < arr.length; i++) {
            if (KREISE_DATA.hasOwnProperty(arr[i])) {
                res.push(KREISE_DATA[arr[i] as keyof typeof KREISE_DATA]);
            } else {
                res.push(arr[i]);
            }
        }
        return res.join('; ');
    }

    public filterBerichteGMB(): any[] {
        const bf = new Array<any>();
        const ber = Object.keys(GMB_DATA);
        for (let i = 0; i < ber.length; i++) {
            const yr = new Array<any>();
            const yk = Object.keys(GMB_DATA[ber[i] as keyof typeof GMB_DATA]);
            for (let y = 0; y < yk.length; y++) {
                const tmp1 = GMB_DATA[ber[i] as keyof typeof GMB_DATA];
                const tmp2 = tmp1[yk[y] as keyof typeof tmp1] as {
                    fileurl: string;
                    file: string;
                    bereich: string[];
                    checksum: {
                        md5: string;
                        sha256: string;
                        sha1: string;
                    };
                };
                if (tmp2.bereich?.includes(this.selectedKreis as string)) {
                    yr.push({
                        'key': yk[y],
                        'value': tmp2
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

    public filterBerichteLMB(): any[] {
        const bf = new Array<any>();
        const bb = new Array<any>();
        const yk = Object.keys(GMB_DATA['Niedersachsen']);

        for (let y = 0; y < yk.length; y++) {
            const tmp1 = GMB_DATA['Niedersachsen' as keyof typeof GMB_DATA];
            bb.push({
                'key': yk[y],
                'value': tmp1[yk[y] as keyof typeof tmp1]
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
     * @param lmb True if LBM
     */
    public filterBerichte(lmb = false): void {
        if (this.selectedKreis === undefined && !lmb) {
            this.berichteFiltered = new Array<any>();
            return;
        }

        if (!lmb) {
            this.berichteFiltered = this.filterBerichteGMB();
        } else {
            this.berichteFiltered = this.filterBerichteLMB();
        }

        this.cdr.detectChanges();
    }


    /**
     * Handle the Change of an Selection in the Map
     * @param param Map param
     */
    public onMapSelectChange(param: any): void {
        const selectedlist = new Array<number>();
        if (param['type'] === 'selectchanged' &&
            (param['fromAction'] === 'select' ||
                param['fromAction'] === 'unselect') &&
            param['selected'].length === 1) {

            param['selected'][0]['dataIndex'].forEach(function (index: number) {
                selectedlist.push(index);
            });
        }

        const ok = Object.keys(KREISE_DATA);
        const item = ok[selectedlist[0]];

        if (item && KREISE_DATA.hasOwnProperty(item)) {
            this.selectedKreis = item as keyof typeof KREISE_DATA;
            this.berichteOpened = new Array<any>();
            this.filterBerichte();
            this.changeURL();
        } else {
            this.selectedKreis = undefined;
            this.berichteOpened = new Array<any>();
            this.filterBerichte();
            this.changeURL();
        }
    }

    private updateMapSelect(): void {
        if (!this.map) {
            return;
        }
        if (this.map.dispatchAction !== undefined) {
            this.map.dispatchAction({
                type: 'select',
                name: this.selectedKreis
            });
        }
    }
    /**
     * Handle Landkreis Select change
     *
     * @param event Change Event
     */
    public onChange(event: Event): void {
        const newValue = event.target as HTMLSelectElement;
        if (!newValue) {
            this.selectedKreis = undefined;
        } else {
            this.selectedKreis = newValue.value as keyof typeof KREISE_DATA;
        }
        this.berichteOpened = new Array<any>();
        this.changeURL();
        this.updateMapSelect();
        this.filterBerichte();
    }

    public keyPress(event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement;
        if (target && event.key === 'Enter') {
            target.checked = !target.checked;
        }
    }

    public checkValue(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.checked === true) {
            this.berichteOpened.push(target.id.substring(2));
        } else {
            const index = this.berichteOpened.indexOf(target.id.substring(2));
            if (index > -1) {
                this.berichteOpened.splice(index, 1);
            }
        }
        this.changeURL();
    }

    public changeURL(): void {
        const params = new URLSearchParams({});
        if (this.mode === 'gmb' && this.selectedKreis) {
            params.append('landkreis', KREISE_DATA[this.selectedKreis]);
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

    public ariaLabelBericht(year: number, rd: string, dl = false): string {
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
     * @returns size in px
     */
    public convertRemToPixels(rem: number): number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
