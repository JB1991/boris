import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { BodenrichtwertComponent } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Feature, FeatureCollection, Point } from 'geojson';
import { AlkisWfsService } from '@app/shared/advanced-search/flurstueck-search/alkis-wfs.service';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';
// eslint-disable-next-line
// @ts-ignore
import { LngLat } from 'maplibre-gl';
import polylabel from 'polylabel';
import area from '@turf/area';

/* eslint-disable max-lines */
@Component({
    selector: 'power-bodenrichtwert-navigation',
    templateUrl: './bodenrichtwert-navigation.component.html',
    styleUrls: ['./bodenrichtwert-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BodenrichtwertNavigationComponent implements OnChanges {

    @Input() public latLng: LngLat;

    @Output() public latLngChange = new EventEmitter<LngLat>();

    @Input() public address?: Feature;

    @Output() public addressChange = new EventEmitter();

    @Input() public features?: FeatureCollection;

    @Output() public featuresChange = new EventEmitter();

    @Input() public teilmarkt?: Teilmarkt;

    @Output() public teilmarktChange = new EventEmitter<Teilmarkt>();

    @Input() public stichtag?: string;

    @Output() public stichtagChange = new EventEmitter<string>();

    @Input() public flurstueck?: FeatureCollection;

    @Output() public flurstueckChange = new EventEmitter();

    @Input() public isCollapsed?: boolean;

    @Output() public isCollapsedChange = new EventEmitter<boolean>();

    @Input() public resetMapFired?: boolean;

    @Output() public resetMapFiredChange = new EventEmitter<boolean>();

    @Input() public zoom?: number;

    @Output() public zoomChange = new EventEmitter<number>();

    @Input() public pitch?: number;

    @Output() public pitchChange = new EventEmitter<number>();

    @Input() public bearing?: number;

    @Output() public bearingChange = new EventEmitter<number>();

    @Input() public standardBaulandZoom?: number;

    @Input() public standardLandZoom?: number;

    public searchActive = false;

    public filterActive = false;

    public functionsActive = false;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public bodenrichtwert: BodenrichtwertComponent,
        public geosearchService: GeosearchService,
        public alerts: AlertsService,
        public alkisWfsService: AlkisWfsService,
        private datePipe: DatePipe,
        private location: Location) { }

    /** @inheritdoc */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.latLng &&
            (changes['latLng'] || changes['teilmarkt'] || changes['stichtag'])) {
            this.updateData();
        }
    }

    /**
     * updateData updates the address, bodenrichtwerte and the flurstueck
     */
    public updateData(): void {
        const lat = this.latLng.lat;
        const lng = this.latLng.lng;
        this.getAddressFromLatLng(lat, lng);
        if (this.teilmarkt) {
            this.getBodenrichtwertzonen(lat, lng, this.teilmarkt.value);
        }
        this.getFlurstueckFromLatLng(lat, lng);
    }

    /**
     * getBodenrichtwertzonen subscribes the bodenrichtwertservice to update
     * the current brwzonen for the current location
     * @param lat latitude
     * @param lng longitude
     * @param entw teilmarkt
     */
    public getBodenrichtwertzonen(lat: number, lng: number, entw: string[]): void {
        this.bodenrichtwertService.getFeatureByLatLonEntw(lat, lng, entw)
            .subscribe(
                (res) => {
                    this.bodenrichtwertService.updateFeatures(res);
                },
                (err) => {
                    console.error(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    /**
     * getAddressFromLatLng subscribes the geosearchservice to update the address for the current location
     * @param lat latitude
     * @param lng longitude
     */
    public getAddressFromLatLng(lat: number, lng: number): void {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(
                (res) => this.geosearchService.updateFeatures(res.features[0]),
                (err) => {
                    console.error(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    /**
     * getFlurstueckFromLatLng subscribes the alkisWfsService to update the flurstueck for the current location
     * @param lat latitude
     * @param lng longitude
     */
    public getFlurstueckFromLatLng(lat: number, lng: number): void {
        this.alkisWfsService.getFlurstueckfromCoordinates(lng, lat).subscribe(
            (res) => this.alkisWfsService.updateFeatures(res),
            (err) => {
                console.error(err);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
            }
        );
    }

    /**
     * onStichtagChange changes the stichtag to another stichtag and
     * emits the selected stichtag
     * @param stichtag stichtag to be switched to
     */
    public onStichtagChange(stichtag: string): void {
        // push info alert for stichtag changed
        if (this.stichtag !== stichtag) {
            this.alerts.NewAlert(
                'info',
                $localize`Stichtag gewechselt`,
                $localize`Der Stichtag wurde zu` + ' ' + this.datePipe.transform(stichtag) + ' ' + $localize`gewechselt.`);
        }

        this.stichtagChange.emit(stichtag);
    }

    /**
     * onTeilmarktChange changes the teilmarkt to another teilmarkt and
     * emits the selected teilmarkt
     * @param teilmarkt teilmarkt to be switched to
     */
    public onTeilmarktChange(teilmarkt: Teilmarkt): void {
        // push info alert
        if (this.teilmarkt !== teilmarkt) {
            this.alerts.NewAlert(
                'info',
                $localize`Teilmarkt gewechselt`,
                $localize`Der Teilmarkt wurde zu` + ' ' + teilmarkt.text + ' ' + $localize`gewechselt.`);
        }

        this.zoomChange.emit(this.determineZoomFactor(teilmarkt));
        this.teilmarktChange.emit(teilmarkt);
    }

    /**
     * determineZoomFactor determines the zoom depending on current zoomlvl and teilmarkt
     * @param teilmarkt teilmarkt
     * @returns returns zoom level depending on selected teilmarkt
     */
    public determineZoomFactor(teilmarkt: Teilmarkt): number {
        // Bauland
        if (this.standardBaulandZoom && teilmarkt.text === 'Bauland') {
            return this.standardBaulandZoom;
            // Landwirtschaft
        } else if (this.standardLandZoom) {
            return this.standardLandZoom;
        }
        return -1;
    }

    /**
     * onAddressChange emits the selected location (latLng) on gesearch item is selected
     * @param feature feature
     */
    public onAddressChange(feature: Feature<Point>): void {
        this.latLngChange.emit(new LngLat(feature?.geometry['coordinates'][0], feature?.geometry['coordinates'][1]));
        if (this.teilmarkt && this.zoom && this.zoom < this.determineZoomFactor(this.teilmarkt)) {
            this.zoomChange.emit(this.determineZoomFactor(this.teilmarkt));
        }
    }

    /**
     * onFlurstueckChange emits the selected location (latLng) on flurstuecksearch item is selected
     * @param fts features
     */
    public onFlurstueckChange(fts: FeatureCollection): void {
        let point: number[] = [];

        switch (fts.features[0].geometry.type) {
            case 'Polygon':
                point = polylabel(fts.features[0].geometry.coordinates, 0.0001, false);
                break;
            case 'MultiPolygon': {
                const p = fts.features[0].geometry.coordinates.map((f) => ({
                    type: 'Polygon',
                    coordinates: f
                })).sort((i, j) => area(i) - area(j)).shift();

                if (p) {
                    point = polylabel(p.coordinates, 0.0001, false);
                }
                break;
            }
            default:
                throw new Error('Unkown type');
        }
        if (this.teilmarkt && this.zoom && this.zoom < this.determineZoomFactor(this.teilmarkt)) {
            this.zoomChange.emit(this.determineZoomFactor(this.teilmarkt));
        }
        this.latLngChange.emit(new LngLat(point[0], point[1]));
    }

    /**
     * resetMap resets all configurations set/made by the user
     */
    public resetMap(): void {
        if (this.latLng) {
            this.latLngChange.emit(undefined);
        }
        if (this.address) {
            this.addressChange.emit(undefined);
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
        if (this.teilmarkt?.text !== this.bodenrichtwert.TEILMAERKTE[0].text) {
            this.teilmarktChange.emit(this.bodenrichtwert.TEILMAERKTE[0]);
        }
        if (this.stichtag !== this.bodenrichtwert.STICHTAGE[0]) {
            this.stichtagChange.emit(this.bodenrichtwert.STICHTAGE[0]);
        }
        if (this.pitch) {
            this.pitchChange.emit(0);
        }
        if (this.bearing) {
            this.bearingChange.emit(0);
        }

        // triggers onResetMap of the map component
        this.resetMapFiredChange.emit(true);

        // reset URL
        this.location.replaceState('/bodenrichtwerte');
    }

    /**
     * onFocus emits the current location to trigger a map focus
     */
    public onFocus(): void {
        if (this.teilmarkt && this.zoom && this.zoom < this.determineZoomFactor(this.teilmarkt)) {
            this.zoomChange.emit(this.determineZoomFactor(this.teilmarkt));
        }
        this.latLngChange.emit(new LngLat(this.latLng.lng, this.latLng.lat));
    }
}
