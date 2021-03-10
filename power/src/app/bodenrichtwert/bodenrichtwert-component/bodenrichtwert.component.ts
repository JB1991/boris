import {
    Component, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnInit, Input
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { Feature, FeatureCollection } from 'geojson';
import { Subscription } from 'rxjs';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { ConfigService } from '@app/config.service';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/bodenrichtwert-karte.component';

import { DatePipe, Location } from '@angular/common';

export interface Teilmarkt {
    value: Array<string>
    text: string
    hexColor: string
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
     * Adresse to be shown
     */
    public adresse: Feature;

    /**
     * Subscription to adresse, loaded by Geosearch-Service
     */
    public adresseSubscription: Subscription;

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

    public latLng: Array<number> = [];

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

    public threeDActive = false;

    public resetMapFired = false;

    @ViewChild('map') public map: BodenrichtwertKarteComponent;

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

    constructor(
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
        public configService: ConfigService,
        private titleService: Title,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.titleService.setTitle($localize`Bodenrichtwerte - Immobilienmarkt.NI`);
        this.adresseSubscription = this.geosearchService.getFeatures().subscribe(adr => {
            this.adresse = adr;
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
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            // lat and lat
            if (params['lat'] && params['lng']) {
                this.latLng[0] = params['lat'];
                this.latLng[1] = params['lng'];
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
            this.cdr.detectChanges();
        });
    }

    /**
     * Destroys all active subscriptions
     */
    ngOnDestroy(): void {
        this.adresseSubscription.unsubscribe();
        this.featureSubscription.unsubscribe();
        this.flurstueckSubscription.unsubscribe();
    }

    /**
     * getStichtag returns the correct stichtag for Bremen/Bremerhaven
     */
    public getStichtag(): string {
        const year: number = Number(this.stichtag.slice(0, 4));
        if (this.features?.features[0]?.properties?.gema === 'Bremerhaven') {
            if (year % 2 === 0) {
                return (year - 1).toString() + '-12-31';
            }
        };

        if (this.features?.features[0]?.properties?.gabe === 'Gutachterausschuss für Grundstückswerte in Bremen') {
            if (year % 2 !== 0) {
                return (year - 1).toString() + '-12-31';
            }
        }
        return year.toString() + '-12-31';
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
        // const lnglat_coordinates = this.map.marker.getLngLat();
        const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
        const utm = '+proj=utm +zone=32';
        // const utm_cordinates = proj4(wgs84, utm, [lnglat_coordinates.lng, lnglat_coordinates.lat]);
        // url += 'east=' + encodeURIComponent(utm_cordinates[0].toFixed(0));
        // url += '&north=' + encodeURIComponent(utm_cordinates[1].toFixed(0));

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

        return url;
    }

    public changeURL() {
        const params = new URLSearchParams({});
        if (this.latLng?.length) {
            params.append('lat', this.latLng[0].toString());
            params.append('lng', this.latLng[1].toString());
        }
        if (this.teilmarkt) {
            params.append('teilmarkt', this.teilmarkt.text.toString());
        }
        if (this.stichtag) {
            params.append('stichtag', this.stichtag.toString());
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
