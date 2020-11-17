import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LngLat, LngLatBounds, Map, Marker } from 'mapbox-gl';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { environment } from '@env/environment';
import { STICHTAGE, TEILMAERKTE } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';

@Component({
    selector: 'power-bodenrichtwertkarte',
    templateUrl: './bodenrichtwert-karte.component.html',
    styleUrls: ['./bodenrichtwert-karte.component.scss']
})
export class BodenrichtwertKarteComponent implements OnInit, OnChanges {

    searchActive = false;
    filterActive = false;
    threeDActive = false;

    isDragged = false;
    previousZoomFactor: number;

    baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    MAP_STYLE_URL = environment.basemap;

    map: Map;
    bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);
    marker: Marker = new Marker({
        color: '#c4153a',
        draggable: true
    }).on('dragstart', () => {
        this.isDragged = !this.isDragged;
    });
    zoom = 18;

    lat: number;
    lng: number;

    @Input() teilmarkt: any;
    @Output() teilmarktChange = new EventEmitter();

    TEILMAERKTE = TEILMAERKTE;

    @Input() stichtag;
    @Output() stichtagChange = new EventEmitter();

    STICHTAGE = STICHTAGE;

    @Input() isCollapsed: () => void;
    @Output() isCollapsedChange = new EventEmitter();

    @Input() isExpanded: () => void;

    @Input() adresse;
    @Output() adresseChange = new EventEmitter();

    @Input() features;
    @Output() featuresChange = new EventEmitter();

    markerRemoving: boolean;
    resetGeosearch: boolean;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public geosearchService: GeosearchService
    ) {
    }

    ngOnChanges() {
        if (this.map && !this.markerRemoving) {
            this.map.resize();
            this.flyTo(this.marker.getLngLat().lat, this.marker.getLngLat().lng);
        } else if (this.map) {
            this.map.resize();
            this.map.fitBounds(this.bounds, {
                pitch: 0,
                bearing: 0
            });
            this.markerRemoving = false;
        }
    }

    ngOnInit() {
    }

    loadMap(event: Map) {
        this.map = event;
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }

    toggleFilterActive() {
        this.filterActive = !this.filterActive;
    }

    selectSearchResult(event: any) {
        this.marker.setLngLat(event.geometry.coordinates).addTo(this.map);
        const lng: number = event.geometry.coordinates[0];
        const lat: number = event.geometry.coordinates[1];
        this.flyTo(lat, lng);
        this.getBodenrichtwertzonen(lat, lng, this.teilmarkt.value);
    }

    flyTo(lat: number, lng: number) {
        this.map.flyTo({
            center: [lng, lat],
            zoom: 14,
            speed: 1,
            curve: 1,
            bearing: 0
        });
    }

    getBodenrichtwertzonen(lat: number, lng: number, entw: Array<string>) {
        this.bodenrichtwertService.getFeatureByLatLonEntw(lat, lng, entw)
            .subscribe(res => this.bodenrichtwertService.updateFeatures(res));
    }

    getAddressFromLatLng(lat: number, lng: number) {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(res => this.geosearchService.updateFeatures(res.features[0]));
    }

    onDragEnd() {
        if (this.marker.getLngLat() && this.isDragged) {
            this.lat = this.marker.getLngLat().lat;
            this.lng = this.marker.getLngLat().lng;

            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
            this.getAddressFromLatLng(this.lat, this.lng);
            this.flyTo(this.lat, this.lng);
            this.isDragged = !this.isDragged;
        }
    }

    onMapClickEvent(event: any) {
        if (event.lngLat) {
            this.lat = event.lngLat.lat;
            this.lng = event.lngLat.lng;

            this.marker.setLngLat([this.lng, this.lat]).addTo(this.map);
            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
            this.getAddressFromLatLng(this.lat, this.lng);
            this.flyTo(this.lat, this.lng);
        }
    }

    onSearchSelect(event: any) {
        this.marker.setLngLat(event.geometry.coordinates).addTo(this.map);
        const lng: number = event.geometry.coordinates[0];
        const lat: number = event.geometry.coordinates[1];
        this.flyTo(lat, lng);
        this.getBodenrichtwertzonen(lat, lng, this.teilmarkt.value);
    }

    toggle3dView() {
        if (!this.threeDActive) {
            this.activate3dView();
        } else if (this.threeDActive) {
            this.deactivate3dView();
        }
        this.threeDActive = !this.threeDActive;
    }

    private activate3dView() {
        this.previousZoomFactor = this.map.getZoom();
        this.map.addLayer({
            id: 'building-extrusion',
            type: 'fill-extrusion',
            source: 'openmaptiles',
            'source-layer': 'building',
            paint: {
                'fill-extrusion-color': 'rgb(219, 219, 218)',
                'fill-extrusion-height': 0,
                'fill-extrusion-opacity': 0.7,
                'fill-extrusion-height-transition': {
                    duration: 600,
                    delay: 0
                }
            }
        });
        this.map.easeTo({
            pitch: 60,
            zoom: 17,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 15);
    }

    private deactivate3dView() {
        this.map.easeTo({
            pitch: 0,
            zoom: this.previousZoomFactor,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
        this.map.removeLayer('building-extrusion');
    }

    onStichtagChange(stichtag: any) {
        this.stichtag = stichtag;
        this.stichtagChange.next(stichtag);
    }

    onTeilmarktChange(teilmarkt: any) {
        this.teilmarkt = teilmarkt;
        this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
    }

    resetMap() {
        this.map.resize();

        if (this.threeDActive) {
            this.deactivate3dView();
        }

        if (this.marker) {
            this.marker.remove();
            this.isCollapsedChange.emit(true);
            if (this.adresse) {
                this.adresseChange.emit(false);
            }
            if (this.features) {
                this.featuresChange.emit(false);
            }
            this.markerRemoving = true;
        }
        this.resetGeosearch = !this.resetGeosearch;
        this.map.fitBounds(this.bounds, {
            pitch: 0,
            bearing: 0
        });
    }

    enableLocationTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(location => {
                const lngLat = new LngLat(location.coords.longitude, location.coords.latitude);
                this.map.easeTo({
                    pitch: 0,
                    zoom: 14,
                    center: lngLat
                });
                this.marker.setLngLat(lngLat).addTo(this.map);
                this.getAddressFromLatLng(lngLat.lat, lngLat.lng);
                this.getBodenrichtwertzonen(lngLat.lat, lngLat.lng, this.teilmarkt.value);
            });
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
