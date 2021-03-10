import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { BodenrichtwertComponent } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Feature, FeatureCollection } from 'geojson';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import * as turf from '@turf/turf';
import proj4 from 'proj4';
import * as epsg from 'epsg';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';
import { LngLat } from 'mapbox-gl';

@Component({
    selector: 'power-bodenrichtwert-navigation',
    templateUrl: './bodenrichtwert-navigation.component.html',
    styleUrls: ['./bodenrichtwert-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BodenrichtwertNavigationComponent implements OnChanges {

    @Input() latLng: Array<number>;
    @Output() latLngChange = new EventEmitter<Array<number>>();

    @Input() adresse: Feature;
    @Output() adresseChange = new EventEmitter();

    @Input() features: FeatureCollection;
    @Output() featuresChange = new EventEmitter();

    @Input() teilmarkt: Teilmarkt;
    @Output() teilmarktChange = new EventEmitter<Teilmarkt>();

    @Input() stichtag: string;
    @Output() stichtagChange = new EventEmitter<string>();

    @Input() flurstueck: FeatureCollection;
    @Output() flurstueckChange = new EventEmitter();

    @Input() isCollapsed: boolean;
    @Output() isCollapsedChange = new EventEmitter<boolean>();

    @Input() threeDActive: boolean;
    @Output() threeDActiveChange = new EventEmitter<boolean>();

    @Input() resetMapFired: boolean;
    @Output() resetMapFiredChange = new EventEmitter<boolean>();

    public searchActive = false;
    public filterActive = false;
    public functionsActive = false;

    public fskIsChanged = false;


    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public bodenrichtwert: BodenrichtwertComponent,
        public geosearchService: GeosearchService,
        public alerts: AlertsService,
        public alkisWfsService: AlkisWfsService,
        private datePipe: DatePipe,
        private location: Location,) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.latLng && !changes.latLng.firstChange && changes.latLng.currentValue !== undefined) {
            this.getAddressFromLatLng(this.latLng[0], this.latLng[1]);
            this.getBodenrichtwertzonen(this.latLng[0], this.latLng[1], this.teilmarkt.value);
            if (!this.fskIsChanged) {
                this.getFlurstueckFromLatLng(this.latLng[0], this.latLng[1]);
            } else {
                this.fskIsChanged = !this.fskIsChanged;
            }
        }
        if (changes.stichtag && changes.stichtag.currentValue === '2020-12-31' && this.adresse?.properties.kreis === 'Stadt Bremen') {
            this.alerts.NewAlert(
                'info',
                $localize`Diese Daten sind noch nicht verfügbar!`,
                $localize`Die Daten für Bremen des Jahres 2021 sind noch im Zulauf, sobald sich dies ändert können die Daten hier dargestellt werden.`
            );
        }
        if (changes.teilmarkt || changes.Stichtag) {
            this.getAddressFromLatLng(this.latLng[0], this.latLng[1]);
            this.getBodenrichtwertzonen(this.latLng[0], this.latLng[1], this.teilmarkt.value);
        }
    }

    public getBodenrichtwertzonen(lat: number, lng: number, entw: Array<string>): void {
        this.bodenrichtwertService.getFeatureByLatLonEntw(lat, lng, entw)
            .subscribe(
                res => {
                    this.bodenrichtwertService.updateFeatures(res);
                    // temporary alert for data of bremen for the year 2021
                    if (res.features[0]?.properties.gabe.includes('Bremen') && this.stichtag === '2020-12-31') {
                        this.alerts.NewAlert(
                            'info',
                            $localize`Diese Daten sind noch nicht verfügbar!`,
                            $localize`Die Daten für Bremen des Jahres 2021 sind noch im Zulauf, sobald sich dies ändert können die Daten hier dargestellt werden.`
                        );
                    }
                },
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    public getAddressFromLatLng(lat: number, lng: number): void {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(
                res => this.geosearchService.updateFeatures(res.features[0]),
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    };

    /**
     * onStichtagChange changes the stichtag to another stichtag and
     * updates the brw/url
     * @param stichtag stichtag to be switched to
     */
    public onStichtagChange(stichtag: string): void {
        // push info alert
        if (this.stichtag !== stichtag) {
            this.alerts.NewAlert(
                'info',
                $localize`Stichtag gewechselt`,
                $localize`Der Stichtag wurde zu ` + this.datePipe.transform(stichtag) + $localize` gewechselt.`);
        }
        this.stichtagChange.emit(stichtag);
    }

    /**
     * onTeilmarktChange changes the teilmarkt to another teilmarkt and
     * updates the brw/url
     * @param teilmarkt teilmarkt to be switched to
     */
    public onTeilmarktChange(teilmarkt: Teilmarkt): void {
        // push info alert
        if (this.teilmarkt !== teilmarkt) {
            this.alerts.NewAlert(
                'info',
                $localize`Teilmarkt gewechselt`,
                $localize`Der Teilmarkt wurde zu ` + teilmarkt.text + $localize` gewechselt.`);
        }
        this.teilmarktChange.emit(teilmarkt);
    }

    public onAdressChange(feature: Feature): void {
        this.latLngChange.emit([feature?.geometry['coordinates'][1], feature?.geometry['coordinates'][0]]);
    }

    toggle3dView() {
        this.threeDActiveChange.emit(!this.threeDActive);
    }

    /**
     * resetMap resets all configurations set/made by the user
     */
    public resetMap() {
        // reset URL
        this.location.replaceState('/bodenrichtwerte');

        // reset coordinates
        if (this.latLng) {
            this.latLngChange.emit(undefined);
        }

        if (this.threeDActive) {
            this.threeDActiveChange.emit(false);
        }

        if (this.adresse) {
            this.adresseChange.emit(undefined);
        }
        if (this.features) {
            this.featuresChange.emit(undefined);
        }
        if (this.flurstueck) {
            this.flurstueckChange.emit(undefined);
        }
        if (!this.isCollapsed) {
            this.isCollapsedChange.emit(true);
        }
        if (this.teilmarkt.text !== this.bodenrichtwert.TEILMAERKTE[0].text) {
            this.teilmarktChange.emit(this.bodenrichtwert.TEILMAERKTE[0]);
        }

        if (this.stichtag !== this.bodenrichtwert.STICHTAGE[0]) {
            this.stichtagChange.emit(this.bodenrichtwert.STICHTAGE[0]);
        }

        this.resetMapFiredChange.emit(true);
    }

    /**
     * Update Address, BRZ, Marker, Map, URL onFlurstueckChange
     */
    public onFlurstueckChange(): void {
        const wgs84_coords = this.pointOnFlurstueck();
        this.fskIsChanged = !this.fskIsChanged;
        this.latLngChange.emit([wgs84_coords[1], wgs84_coords[0]]);
    }

    /**
     * pointOnFlurstueck returns a point (transformed to wgs84) guranteed to be on the feature
     */
    public pointOnFlurstueck(): number[] {
        const polygon = turf.polygon(this.flurstueck.features[0].geometry['coordinates']);
        const point = turf.pointOnFeature(polygon);
        const wgs84_point = this.transformCoordinates(
            epsg['EPSG:3857'],
            epsg['EPSG:4326'],
            [
                point.geometry.coordinates[0],
                point.geometry.coordinates[1]
            ]
        );
        return wgs84_point;
    }

    public getFlurstueckFromLatLng(lat: number, lng: number): void {
        this.alkisWfsService.getFlurstueckfromCoordinates(lng, lat).subscribe(
            res => this.alkisWfsService.updateFeatures(res),
            err => {
                console.log(err);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
            }
        );
    };




    enableLocationTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(location => {
                const lngLat = new LngLat(location.coords.longitude, location.coords.latitude);
                this.latLngChange.emit([lngLat.lat, lngLat.lng]);
            });
        }
    }

    /**
    * Transforms coordinates from one projection to another projection with EPSG-Codes
    * @param from projection from (EPSG-Code)
    * @param to projection to (EPSG-Code)
    * @param coord coordinate [x, y]
    */
    private transformCoordinates(from: string, to: string, coord: number[]): number[] {
        const result = proj4(from, to).forward(coord);
        return result;
    }
}
