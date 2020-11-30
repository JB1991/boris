import {
    Component, ElementRef, OnDestroy, ViewChild,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { Feature } from 'geojson';
import { Subscription } from 'rxjs';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { Flurstueck } from '@app/shared/flurstueck-search/flurstueck-search.component';

/**
 * Possible selections of Stichtage
 */
export const STICHTAGE = [
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
export const TEILMAERKTE = [
    { value: ['B', 'SF', 'R', 'E'], viewValue: $localize`Bauland`, color: '#c4153a' },
    { value: ['LF'], viewValue: $localize`Land- und forstwirtschaftliche Flächen`, color: '#009900' },
];

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
    public flurstueck: Flurstueck;

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

    constructor(
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private alkisWfsService: AlkisWfsService,
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
            this.cdr.detectChanges();
            this.isCollapsed = false;
        });
        this.flurstueckSubscription = this.alkisWfsService.getFeatures().subscribe(fst => {
            this.flurstueck = fst;
            this.cdr.detectChanges();
        });
        this.stichtag = STICHTAGE[0];
        this.teilmarkt = TEILMAERKTE[0];
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
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
