/* eslint-disable max-lines */
import {
    Component, OnDestroy, Inject, PLATFORM_ID,
    ChangeDetectionStrategy, ChangeDetectorRef, OnInit
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { Feature, FeatureCollection } from 'geojson';
import { Subscription } from 'rxjs';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import proj4 from 'proj4';
import { DatePipe, Location, isPlatformBrowser } from '@angular/common';
import { LngLat } from 'mapbox-gl';

export interface Teilmarkt {
    value: Array<string>;
    text: string;
    hexColor: string;
}

/**
 * Bodenrichtwert-Component arranges all Components on a single page
 */
@Component({
    selector: 'power-main',
    templateUrl: 'bodenrichtwert.component.html',
    styleUrls: ['bodenrichtwert.component.scss'],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertComponent implements OnInit, OnDestroy {

    /**
     * Address to be shown
     */
    public address: Feature;

    /**
     * Subscription to address, loaded by Geosearch-Service
     */
    public addressSubscription: Subscription;

    /**
     * Features (Bodenrichtwerte as GeoJSON) to be shown
     */
    public features: FeatureCollection = null;

    /**
     * Subscription to features, loaded by Bodenrichtwert-Service
     */
    public featureSubscription: Subscription;

    /**
     * Subscription to features, loaded by AlkisWfs-Service
     */
    public flurstueckSubscription: Subscription;

    /**
     * Feature as Flurstueck
     */
    public flurstueck: FeatureCollection;

    /**
     * Actual selected Stichtag
     */
    public stichtag: string;

    /**
     * Actual selected Teilmarkt
     */
    public teilmarkt: Teilmarkt;

    public latLng: LngLat;

    /**
     * isCollapsed holds the state for details component collapsed or not (click events)
     */
    public isCollapsed = true;

    /**
     * collapsed holds the state for details component completly collapsed
     * (fired by collapse event)
     */
    public collapsed = false;

    /**
     * expanded holds the state for details component completly expanded
     * (fired by collapse event)
     */
    public expanded = true;

    /**
     * hintsActive holds the state for hints on/off
     */
    public hintsActive = false;

    /**
     * resetMapFired triggers the resetMap for the map
     */
    public resetMapFired = false;

    // Flurstuecke become visible at Zoomfactor 15.1
    public standardBaulandZoom = 15.1;
    public standardLandZoom = 11;

    /**
     * zoom holds the current zoom of the map object
     */
    public zoom = 7;

    /**
     * pitch
     */
    public pitch = 0;

    /**
     * bearing
     */
    public bearing = 0;

    /**
     * true if is browser
     */
    public isBrowser = true;

    /**
     * Possible selections of Stichtage
     */
    public STICHTAGE: Array<string> = [
        '2020-12-31',
        '2019-12-31',
        '2018-12-31',
        '2017-12-31',
        '2016-12-31',
        '2015-12-31',
        '2014-12-31',
        '2013-12-31',
        '2012-12-31',
    ];

    /**
     * Possible selections of Teilmärkte
     */
    public TEILMAERKTE: Array<Teilmarkt> = [
        { value: ['B', 'SF', 'R', 'E'], text: $localize`Bauland`, hexColor: '#c4153a' },
        { value: ['LF'], text: $localize`Land- und forstwirtschaftliche Flächen`, hexColor: '#009900' },
    ];

    /* istanbul ignore next */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
        private titleService: Title,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public location: Location,
        private meta: Meta,
    ) {
        this.titleService.setTitle($localize`Bodenrichtwerte - Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'description', content: $localize`Die Bodenrichtwerte für Niedersachsen und Bremen werden mit zeitlicher Entwicklung dargestellt` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Bremen, Bremerhaven, Wertermittlung, Bodenrichtwerte, BORIS, Bo­den­richt­wert­zo­ne` });

        this.addressSubscription = this.geosearchService.getFeatures().subscribe(adr => {
            this.address = adr;
            this.hintsActive = false;
            this.cdr.detectChanges();
        });
        this.featureSubscription = this.bodenrichtwertService.getFeatures().subscribe(ft => {
            this.features = ft;
            this.isCollapsed = false;
            this.cdr.detectChanges();
        });
        this.flurstueckSubscription = this.alkisWfsService.getFeatures().subscribe(fst => {
            this.flurstueck = fst;
            this.cdr.detectChanges();
        });
        this.stichtag = this.STICHTAGE[0];
        this.teilmarkt = this.TEILMAERKTE[0];

        this.changeURL();

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
    }

    /* istanbul ignore next */
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            // lat and lat
            if (params['lat'] && params['lng']) {
                this.latLng = new LngLat(params['lng'], params['lat']);
                // coordinate exists but no zoom
                if (!params['zoom'] && params['teilmarkt'] === 'Bauland') {
                    this.zoom = this.standardBaulandZoom;
                } else {
                    this.zoom = this.standardLandZoom;
                }
            }

            // teilmarkt
            if (params['teilmarkt']) {
                const filteredTeilmarkt = this.TEILMAERKTE.filter((res: Teilmarkt) => res.text === params['teilmarkt']);
                this.teilmarkt = filteredTeilmarkt[0];
            }

            // stichtag
            if (params['stichtag']) {
                this.stichtag = params['stichtag'];
            }

            // zoom
            if (params['zoom']) {
                this.zoom = Number(params['zoom']);
            }

            // rotation
            if (params['pitch']) {
                this.pitch = Number(params['pitch']);
            }

            // bearing
            if (params['bearing']) {
                this.bearing = Number(params['bearing']);
            }
            this.cdr.detectChanges();
        });
    }

    /**
     * Destroys all active subscriptions
     */
    ngOnDestroy(): void {
        this.addressSubscription.unsubscribe();
        this.featureSubscription.unsubscribe();
        this.flurstueckSubscription.unsubscribe();
    }

    /**
     * getStichtag returns the correct stichtag for Bremen/Bremerhaven
     */
    public getStichtag(): string {
        const index = this.STICHTAGE.indexOf(this.stichtag);
        if (index < 0) {
            return this.STICHTAGE[0];
        }

        const year = Number(this.stichtag.slice(0, 4));

        if (this.features?.features[0]?.properties?.gema === 'Bremerhaven') {
            if (index >= this.STICHTAGE.length - 1) {
                return '2011-12-31';
            }
            if (year % 2 === 0) {
                return this.STICHTAGE[index + 1];
            }
        };

        if (index >= this.STICHTAGE.length - 1) {
            return this.STICHTAGE[this.STICHTAGE.length - 1];
        }

        if (this.features?.features[0]?.properties?.gabe === 'Gutachterausschuss für Grundstückswerte in Bremen') {
            if (year % 2 !== 0) {
                return this.STICHTAGE[index + 1];
            }
        }
        return this.STICHTAGE[index];
    }

    /**
     * updates collapsed and expanded onCollapsingEnds
     */
    public onCollapsingEnds() {
        this.collapsed = !this.collapsed;
        this.expanded = false;
    }

    /**
     * updates collapsed and expanded onExpandingEnds
     */
    public onExpandingEnds() {
        this.expanded = !this.expanded;
        this.collapsed = false;
    }

    /**
     * printURL builds the url for the current location
     */
    public printURL(): string {
        let url = '/boris-print/?';

        // coordinates
        const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
        const utm = '+proj=utm +zone=32';
        const utm_coords = proj4(wgs84, utm, [Number(this.latLng.lng), Number(this.latLng.lat)]);
        url += 'east=' + encodeURIComponent(utm_coords[0].toFixed(0));
        url += '&north=' + encodeURIComponent(utm_coords[1].toFixed(0));

        // year
        url += '&year=' + encodeURIComponent(parseInt(this.stichtag.substring(0, 4), 10) + 1);

        // submarket
        url += '&submarket=';
        switch (this.teilmarkt.text) {
            case this.TEILMAERKTE[0].text: {
                url += encodeURIComponent('Bauland');
                break;
            }
            case this.TEILMAERKTE[1].text: {
                url += encodeURIComponent('Landwirtschaft');
                break;
            }
            default: {
                throw new Error('Unknown teilmarkt');
            }
        }

        // zoom
        url += '&zoom=';
        const zoom = this.zoom;
        if (this.teilmarkt.text === this.TEILMAERKTE[0].text) {
            // Bauland
            if (zoom >= 16) {
                url += '2500';
            } else if (zoom >= 15) {
                url += '5000';
            } else if (zoom >= 14) {
                url += '10000';
            } else if (zoom >= 13) {
                url += '25000';
            } else {
                url += '50000';
            }
        } else {
            // Landwirtschaft
            if (zoom >= 10.5) {
                url += '100000';
            } else {
                url += '200000';
            }
        }

        // return url
        return url;
    }

    /**
     * changeURL updates the URL if stichtag, teilmarkt or latLng changed
     */
    public changeURL() {
        const params = new URLSearchParams({});
        if (this.latLng) {
            params.append('lat', this.latLng.lat.toString());
            params.append('lng', this.latLng.lng.toString());
        }
        if (this.teilmarkt) {
            params.append('teilmarkt', this.teilmarkt.text.toString());
        }
        if (this.stichtag) {
            params.append('stichtag', this.stichtag.toString());
        }
        if (this.zoom) {
            params.append('zoom', this.zoom.toFixed(2).toString());
        }
        if (this.pitch) {
            params.append('pitch', this.pitch.toFixed(2).toString());
        }
        if (this.bearing) {
            params.append('bearing', this.bearing.toFixed(2).toString());
        }
        this.location.replaceState('/bodenrichtwerte', params.toString());
    }

    /**
     * checkIfStichtagFtsExist checks if features for the currently selected stichtag exist
     */
    public checkIfStichtagFtsExist(): boolean {
        const filteredFts = this.features.features.filter((ft: Feature) =>
            ft.properties.stag.substr(0, 10) === this.stichtag
        );
        if (filteredFts.length) {
            return true;
        } else {
            return false;
        }

    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
