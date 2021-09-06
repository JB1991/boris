/* eslint-disable max-lines */
import {
    Component, OnDestroy, Inject, PLATFORM_ID, OnInit,
    ChangeDetectionStrategy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { DatePipe, Location, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line
// @ts-ignore
import { LngLat, LngLatBounds } from 'maplibre-gl';
import { Feature, FeatureCollection } from 'geojson';

import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/advanced-search/flurstueck-search/alkis-wfs.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { SEOService } from '@app/shared/seo/seo.service';
import { BodenrichtwertKarteService } from '../bodenrichtwert-karte/bodenrichtwert-karte.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

/**
 * Teilmarkt
 */
export interface Teilmarkt {
    value: string[];
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
     * Print modal
     */
    @ViewChild('print') public printModal?: ModalminiComponent;

    /**
     * Address to be shown
     */
    public address?: Feature;

    /**
     * Subscription to address, loaded by Geosearch-Service
     */
    public addressSubscription: Subscription;

    /**
     * Features (Bodenrichtwerte as GeoJSON) to be shown
     */
    public features?: FeatureCollection = undefined;

    public filteredFeatures?: Feature[];

    public hasUmrechnungsdateien = false;

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
    public flurstueck?: FeatureCollection;

    /**
     * Actual selected Stichtag
     */
    public stichtag: string;

    /**
     * Actual selected Teilmarkt
     */
    public teilmarkt: Teilmarkt;

    public latLng?: LngLat;

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
    public STICHTAGE: string[] = [
        '2020-12-31',
        '2019-12-31',
        '2018-12-31',
        '2017-12-31',
        '2016-12-31',
        '2015-12-31',
        '2014-12-31',
        '2013-12-31',
        '2012-12-31'
    ];

    /**
     * Possible selections of Teilmärkte
     */
    public TEILMAERKTE: Teilmarkt[] = [
        { value: ['B', 'SF', 'R', 'E'], text: $localize`Bauland`, hexColor: '#c4153a' },
        { value: ['LF'], text: $localize`Land- und forstwirtschaftliche Flächen`, hexColor: '#009900' }
    ];

    /* istanbul ignore next */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        private geosearchService: GeosearchService,
        public mapService: BodenrichtwertKarteService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public location: Location,
        private seo: SEOService,
        private alerts: AlertsService
    ) {
        this.seo.setTitle($localize`Bodenrichtwerte - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Bodenrichtwerte für Bauland und landwirtschaftliche Nutzflächen werden flächendeckend in BORIS.NI für das Land Niedersachsen und Bremen kostenfrei zur Verfügung gestellt.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Nutzfläche, Bo­den­richt­wert­zo­ne, Bremen` });

        this.addressSubscription = this.geosearchService.getFeatures().subscribe((adr) => {
            this.address = adr;
            this.hintsActive = false;
            this.cdr.detectChanges();
        });
        this.featureSubscription = this.bodenrichtwertService.getFeatures().subscribe((ft) => {
            this.features = ft;
            this.hasUmrechnungsdateien = false;

            // filter features
            if (this.features || this.stichtag || this.teilmarkt) {
                this.filteredFeatures = this.features.features.filter((ftx) => ftx.properties?.['stag'] === this.stichtag + 'Z').sort((i, j) => i.properties?.['brw'] - j.properties?.['brw']);
            }

            // check for umrechnungsdateien
            if (this.filteredFeatures) {
                for (const feature of this.filteredFeatures) {
                    if (feature.properties?.['umrechnungstabellendatei']
                        && feature.properties?.['umrechnungstabellendatei'].length > 0) {
                        this.hasUmrechnungsdateien = true;
                        break;
                    }
                }
            }

            this.isCollapsed = false;
            this.cdr.detectChanges();
        });
        this.flurstueckSubscription = this.alkisWfsService.getFeatures().subscribe(
            (fst) => {
                this.flurstueck = fst;
                this.cdr.detectChanges();
            },
            (err) => {
                console.error(err);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
            }
        );
        this.stichtag = this.STICHTAGE[0];
        this.teilmarkt = this.TEILMAERKTE[0];

        if (!isPlatformBrowser(this.platformId)) {
            this.isBrowser = false;
        }
    }

    /* istanbul ignore next */
    /** @inheritdoc */
    public ngOnInit(): void {
        // eslint-disable-next-line complexity
        this.route.queryParams.subscribe((params) => {
            // lat and lat
            const lat = Number(params['lat']);
            const lng = Number(params['lng']);
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
            this.zoom = this.validateZoom(Number(params['zoom']));

            // rotation
            this.pitch = this.validatePitch(Number(params['pitch']));

            // bearing
            this.bearing = this.validateBearing(Number(params['bearing']));

            this.cdr.detectChanges();
            this.changeURL();
        });
    }

    /**
     * Destroys all active subscriptions
     */
    public ngOnDestroy(): void {
        this.addressSubscription.unsubscribe();
        this.featureSubscription.unsubscribe();
        this.flurstueckSubscription.unsubscribe();
    }

    /**
     * validateZoom validates the url zoom param
     * @param zoom zoom param
     * @returns validated zoom
     */
    public validateZoom(zoom: number): number {
        if (!zoom) {
            return 7;
        }
        if (zoom >= 18) {
            return 18;
        } else if (zoom <= 5) {
            return 5;
        }
        return zoom;
    }

    /**
     * validatePitch validates the url pitch param
     * @param pitch pitch param
     * @returns validated pitch
     */
    public validatePitch(pitch: number): number {
        if (!pitch) {
            return 0;
        }
        if (pitch >= 60) {
            return 60;
        } else if (pitch <= 0) {
            return 0;
        }
        return pitch;
    }

    /**
     * validateBearing validates the bearing url param
     * @param bearing bearing param
     * @returns validated bearing
     */
    public validateBearing(bearing: number): number {
        if (!bearing) {
            return 0;
        }
        if (bearing >= 180) {
            return 180;
        } else if (bearing <= -180) {
            return -180;
        }
        return bearing;
    }

    /**
     * validateLngLat validates the latitude and longitude
     * @param lat latitude
     * @param lng longitude
     * @returns true/false if lat and lng are valid
     */
    public validateLngLat(lat: number, lng: number): boolean {
        if ((lat <= 90 && lat >= -90) && (lng <= 180 && lng >= -180)) {
            const latLng = new LngLat(lng, lat);
            if (this.bounds.contains(latLng)) {
                return true;
            }
            return false;
        }
        return false;
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

        if (this.features?.features[0]?.properties?.['gema'] === 'Bremerhaven') {
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

        if (this.features?.features[0]?.properties?.['gabe'] === 'Gutachterausschuss für Grundstückswerte in Bremen') {
            if (year % 2 !== 0) {
                return this.STICHTAGE[index + 1];
            }
        }
        return this.STICHTAGE[index];
    }

    /**
     * updates collapsed and expanded onCollapsingEnds
     */
    public onCollapsingEnds(): void {
        this.collapsed = !this.collapsed;
        this.expanded = false;
    }

    /**
     * updates collapsed and expanded onExpandingEnds
     */
    public onExpandingEnds(): void {
        this.expanded = !this.expanded;
        this.collapsed = false;
    }

    /**
     * changeURL updates the URL if stichtag, teilmarkt or latLng changed
     */
    public changeURL(): void {
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
        const filteredFts = this.features?.features.filter((ft: Feature) =>
            ft.properties?.['stag'].substr(0, 10) === this.stichtag
        );
        if (filteredFts?.length) {
            return true;
        }
        return false;
    }

    /**
     * Opens print modal
     */
    public openPrintModal(): void {
        if (this.printModal) {
            this.printModal.open($localize`Bodenrichtwerte - amtlicher Ausdruck`);
        }
    }

    /**
     * rewriteUmrechnungstabURL rewrites the url of the boris alt umrechnungstabellen/dateien
     * @param url url of boris alt
     * @returns rewritedURL for the new location
     */
    public rewriteUmrechnungstabURL(url: string): string {
        const path = url.replace('http://boris.niedersachsen.de', '');
        return location.protocol + '//' + location.host + '/boris-umdatei' + path.substr(0, path.lastIndexOf('.')) + '.pdf';
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
