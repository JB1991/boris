/* eslint-disable max-lines */
import {
    Component, OnDestroy, Inject, PLATFORM_ID, OnInit,
    ChangeDetectionStrategy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { DatePipe, Location, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LngLat, LngLatBounds } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';

import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/advanced-search/flurstueck-search/alkis-wfs.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { SEOService } from '@app/shared/seo/seo.service';

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
     * NDS Bounds MapLibre Type
     */
    public bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);
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

    /**
     * Print modal
     */
    @ViewChild('print') public printModal: ModalminiComponent;

    /* istanbul ignore next */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public location: Location,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Bodenrichtwerte - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Bodenrichtwerte für Bauland und landwirtschaftliche Nutzflächen werden flächendeckend in BORIS.NI für das Land Niedersachsen und Bremen kostenfrei zur Verfügung gestellt.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Nutzfläche, Bo­den­richt­wert­zo­ne, Bremen` });

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

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
    }

    /* istanbul ignore next */
    ngOnInit() {
        // eslint-disable-next-line complexity
        this.route.queryParams.subscribe(params => {
            // lat and lat
            const lat = +params['lat'];
            const lng = +params['lng'];
            if (lat && lng) {
                if (this.validateLngLat(lat, lng)) {
                    this.latLng = new LngLat(lng, lat);
                }
                // coordinate exists but no zoom
                if (this.latLng && !params['zoom'] && params['teilmarkt'] === 'Bauland') {
                    this.zoom = this.standardBaulandZoom;
                } else {
                    this.zoom = this.standardLandZoom;
                }
            }

            // teilmarkt
            if (params['teilmarkt']) {
                const filteredTeilmarkt = this.TEILMAERKTE.filter((res: Teilmarkt) => res.text === params['teilmarkt']);
                if (filteredTeilmarkt.length) {
                    this.teilmarkt = filteredTeilmarkt[0];
                }
            }

            // stichtag
            if (this.STICHTAGE.includes(params['stichtag'])) {
                this.stichtag = params['stichtag'];
            }

            // zoom
            const zoomParam = +params['zoom'];
            if (zoomParam) {
                if (zoomParam >= 18) {
                    this.zoom = 18;
                } else if (zoomParam <= 5) {
                    this.zoom = 5;
                } else {
                    this.zoom = zoomParam;
                }
            } else {
                this.zoom = 7;
            }

            // rotation
            const pitchParam = +params['pitch'];
            if (pitchParam) {
                if (pitchParam >= 60) {
                    this.pitch = 60;
                } else if (pitchParam <= 0) {
                    this.pitch = 0;
                } else {
                    this.pitch = pitchParam;
                }
            }

            // bearing
            const bearingParam = +params['bearing'];
            if (bearingParam) {
                if (bearingParam >= 180) {
                    this.bearing = 180;
                } else if (bearingParam <= -180) {
                    this.bearing = -180;
                } else {
                    this.bearing = bearingParam;
                }
            }
            this.cdr.detectChanges();
            this.changeURL();
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
     * validateLngLat validates the latitude and longitude
     * @param lat latitude
     * @param lng longitude
     * @returns true/false if lat and lng are valid
     */
    private validateLngLat(lat: number, lng: number): boolean {
        if ((lat <= 90 && lat >= -90) && (lng <= 180 && lng >= -180)) {
            const latLng = new LngLat(lng, lat);
            if (this.bounds.contains(latLng)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * getStichtag calculate the correct stichtag for Bremen/Bremerhaven
     * @returns returns the correct stichtag for Bremen/Bremerhaven
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
        }

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
     * @returns true or false if feature array is filled or is empty
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
