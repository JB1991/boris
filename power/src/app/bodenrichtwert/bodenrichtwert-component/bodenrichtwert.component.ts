import {
    Component, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { Feature, FeatureCollection } from 'geojson';
import { Subscription } from 'rxjs';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { ConfigService } from '@app/config.service';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/bodenrichtwert-karte.component';
import proj4 from 'proj4';

/**
 * Bodenrichtwert-Component arranges all Components on a single page
 */
@Component({
    selector: 'power-main',
    templateUrl: 'bodenrichtwert.component.html',
    styleUrls: ['bodenrichtwert.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertComponent implements OnDestroy {

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
    public features = null;

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
    public stichtag;

    /**
     * Actual selected Teilmarkt
     */
    public teilmarkt: any;

    public isCollapsed = true;

    public collapsed = false;

    public expanded = true;

    public showPrintNotice = true;

    @ViewChild('map') public map: BodenrichtwertKarteComponent;

    constructor(
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
        public configService: ConfigService,
        private titleService: Title,
        private cdr: ChangeDetectorRef
    ) {
        this.titleService.setTitle($localize`Bodenrichtwerte - POWER.NI`);
        this.adresseSubscription = this.geosearchService.getFeatures().subscribe(adr => {
            this.adresse = adr;
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
        this.stichtag = this.bodenrichtwertService.STICHTAGE[0];
        this.teilmarkt = this.bodenrichtwertService.TEILMAERKTE[0];
    }

    /**
     * Destroys all active subscriptions
     */
    ngOnDestroy(): void {
        this.adresseSubscription.unsubscribe();
        this.featureSubscription.unsubscribe();
    }

    public onCollapsingEnds() {
        this.collapsed = !this.collapsed;
        this.expanded = false;
    }

    public onExpandingEnds() {
        this.expanded = !this.expanded;
        this.collapsed = false;
    }

    public printURL(): string {
        let url = '/boris-print/';

        // coordinates
        const lnglat_coordinates = this.map.marker.getLngLat();
        const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
        const utm = '+proj=utm +zone=32';
        const utm_cordinates = proj4(wgs84, utm, [lnglat_coordinates.lng, lnglat_coordinates.lat]);
        url += 'east=' + encodeURIComponent(utm_cordinates[0].toFixed(0));
        url += '&north=' + encodeURIComponent(utm_cordinates[1].toFixed(0));

        // year
        url += '&year=' + encodeURIComponent(parseInt(this.stichtag.substring(0, 4), 10) + 1);

        // submarket
        url += '&submarket=';
        switch (this.teilmarkt.viewValue) {
            case this.bodenrichtwertService.TEILMAERKTE[0].viewValue: {
                url += encodeURIComponent('Bauland');
                break;
            }
            case this.bodenrichtwertService.TEILMAERKTE[1].viewValue: {
                url += encodeURIComponent('Landwirtschaft');
                break;
            }
            default: {
                throw new Error('Unknown teilmarkt');
            }
        }

        // return url
        return url;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
