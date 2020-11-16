import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { Feature } from 'geojson';
import { Subscription } from 'rxjs';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';

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
    { value: ['B', 'SF', 'R', 'E'], viewValue: $localize`Bauland`, color: '#c4153a'},
    { value: ['LF'], viewValue: $localize`Land- und forstwirtschaftliche Flächen`, color: '#009900' },
];

/**
 * Bodenrichtwert-Component arranges all Components on a single page
 */
@Component({
    selector: 'power-main',
    templateUrl: 'bodenrichtwert.component.html',
    styleUrls: ['bodenrichtwert.component.css']
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
     * Actual selected Stichtag
     */
    public stichtag;

    /**
     * Actual selected Teilmarkt
     */
    public teilmarkt: any;

    public isCollapsed = true;

    public isExpanded = true;

    @ViewChild('collapse') collapse: ElementRef;

    constructor(
        private geosearchService: GeosearchService,
        private bodenrichtwertService: BodenrichtwertService,
        private titleService: Title
    ) {
        this.titleService.setTitle($localize`Bodenrichtwerte - POWER.NI`);
        this.adresseSubscription = this.geosearchService.getFeatures().subscribe(adr => this.adresse = adr);
        this.featureSubscription = this.bodenrichtwertService.getFeatures().subscribe(ft => {
            this.features = ft;
            this.isCollapsed = false;
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
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
