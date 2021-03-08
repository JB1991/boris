import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Feature, FeatureCollection } from 'geojson';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import * as turf from '@turf/turf';
import proj4 from 'proj4';
import * as epsg from 'epsg';

@Component({
    selector: 'power-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationComponent implements OnInit, OnChanges {

    public lat: number;
    public lng: number;
    @Output() latChange = new EventEmitter<number>();

    public latitude: number;

    @Input() adresse: Feature;
    // @Output() adresseChange = new EventEmitter();

    @Input() features: FeatureCollection;
    // @Output() featuresChange = new EventEmitter();

    @Input() teilmarkt: any;
    @Output() teilmarktChange = new EventEmitter();

    @Input() stichtag: string;
    @Output() stichtagChange = new EventEmitter();

    @Input() flurstueck: FeatureCollection;
    // @Output() flurstueckChange = new EventEmitter();

    @Input() isCollapsed;
    @Output() isCollapsedChange = new EventEmitter();

    @Input() expanded;

    @Input() collapsed;

    public searchActive = false;
    public filterActive = false;
    public threeDActive = false;
    public functionsActive = false;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public geosearchService: GeosearchService,
        public alerts: AlertsService,
        public alkisWfsService: AlkisWfsService,
        private datePipe: DatePipe,
        private location: Location,
        private cdr: ChangeDetectorRef,) { }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit(): void {
    }


    updateLatLng(event: number) {
        this.lat = event[0];
        this.lng = event[1];
        this.getAddressFromLatLng(this.lat, this.lng);
        this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        this.getFlurstueckFromLatLng(this.lat, this.lng);
        this.changeURL();
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
    public onStichtagChange(stichtag: any): void {
        this.stichtag = stichtag;

        const stichtagIsEqual = this.location.path().includes('stichtag=' + this.stichtag);
        // push info alert
        if (!stichtagIsEqual) {
            this.alerts.NewAlert(
                'info',
                $localize`Stichtag gewechselt`,
                $localize`Der Stichtag wurde zu ` + this.datePipe.transform(stichtag) + $localize` gewechselt.`);
        }

        this.stichtagChange.next(stichtag);

        // this.repaintMap();

        this.changeURL();
    }

    /**
     * onTeilmarktChange changes the teilmarkt to another teilmarkt and
     * updates the brw/url
     * @param teilmarkt teilmarkt to be switched to
     */
    public onTeilmarktChange(teilmarkt: any): void {
        this.teilmarkt = teilmarkt;

        const teilmarktIsEqual = this.location.path().includes('teilmarkt=' + this.teilmarkt.viewValue.split(' ', 1));
        // push info alert
        if (!teilmarktIsEqual) {
            this.alerts.NewAlert(
                'info',
                $localize`Teilmarkt gewechselt`,
                $localize`Der Teilmarkt wurde zu ` + teilmarkt.viewValue + $localize` gewechselt.`);
        }

        this.teilmarktChange.emit(this.teilmarkt);
        if (this.lat && this.lng) {
            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        }

        this.changeURL();
    }

    public onAdressChange(event: any): void {
        // this.adresse = adresse;
        this.lat = event?.geometry.coordinates[1];
        this.lng = event?.geometry.coordinates[0];
        this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        this.getFlurstueckFromLatLng(this.lat, this.lng);
        this.changeURL();
    }

    /**
     * Update Address, BRZ, Marker, Map, URL onFlurstueckChange
     */
    public onFlurstueckChange(): void {
        // this.fskIsChanged = true;
        const wgs84_coords = this.pointOnFlurstueck();
        this.lat = wgs84_coords[1];
        this.lng = wgs84_coords[0];
        // this.marker.setLngLat([wgs84_coords[0], wgs84_coords[1]]).addTo(this.map);
        this.getAddressFromLatLng(wgs84_coords[1], wgs84_coords[0]);
        this.getBodenrichtwertzonen(wgs84_coords[1], wgs84_coords[0], this.teilmarkt.value);
        // this.flyTo(wgs84_coords[1], wgs84_coords[0]);
        this.changeURL();
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

    private changeURL() {
        const params = new URLSearchParams({});
        if (this.lat) {
            params.append('lat', this.lat.toString());
        }
        if (this.lng) {
            params.append('lng', this.lng.toString());
        }
        if (this.teilmarkt) {
            params.append('teilmarkt', this.teilmarkt.viewValue.toString());
        }
        if (this.stichtag) {
            params.append('stichtag', this.stichtag.toString());
        }
        this.location.replaceState('/bodenrichtwerte', params.toString());
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
