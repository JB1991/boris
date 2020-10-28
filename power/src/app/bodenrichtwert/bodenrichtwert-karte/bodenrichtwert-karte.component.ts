import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class BodenrichtwertKarteComponent implements OnInit {

    searchActive = false;
    filterActive = false;
    threeDActive = false;

    isDragged: boolean = false;

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
        this.isDragged = true;
    } );

    zoom = 18;

    lat: number;
    lng: number;

    @Input() teilmarkt;
    @Output() teilmarktChange = new EventEmitter();

    TEILMAERKTE = TEILMAERKTE;

    @Input() stichtag;
    @Output() stichtagChange = new EventEmitter();

    STICHTAGE = STICHTAGE;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public geosearchService: GeosearchService
    ) {
    }
    @Input() isCollapsed;

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

    flyTo(event: any) {
        this.marker.setLngLat(event.geometry.coordinates).addTo(this.map);
        this.map.flyTo({
            center: event.geometry.coordinates,
            zoom: 14,
            speed: 1,
            curve: 1,
            bearing: 0
        });
        this.getBodenrichtwertzonen(
            event.geometry.coordinates[1],
            event.geometry.coordinates[0],
            this.teilmarkt.value);
    }

    getBodenrichtwertzonen(lat: number, lng: number, entw: string) {
        this.bodenrichtwertService.getFeatureByLatLonEntw(lat, lng, entw).subscribe(res => {
            this.bodenrichtwertService.updateFeatures(res);
        });
    }

    getAddressFromLatLng(lat: number, lng: number) {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(res => this.geosearchService.updateFeatures(res.features[0]));
    }

    onDragEnd() {
        if (this.marker.getLngLat() && this.isDragged === true) {
            this.lat = this.marker.getLngLat().lat;
            this.lng = this.marker.getLngLat().lng;

            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
            this.getAddressFromLatLng(this.lat, this.lng);
            this.map.flyTo({
                center: [this.lng, this.lat],
                zoom: 14,
                speed: 1,
                curve: 1,
                bearing: 0
            });
            this.isDragged = false;
        }
    }

    onMapClickEvent(event: any) {
        if (event.lngLat) {
            this.lat = event.lngLat.lat;
            this.lng = event.lngLat.lng;

            this.marker.setLngLat([this.lng, this.lat]).addTo(this.map);
            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
            this.getAddressFromLatLng(this.lat, this.lng);
            this.map.flyTo({
                center: [this.lng, this.lat],
                zoom: 14,
                speed: 1,
                curve: 1,
                bearing: 0
            });
        }
    }

    onSearchSelect(event: any) {
        this.marker.setLngLat(event.geometry.coordinates).addTo(this.map);
        this.map.flyTo({
            center: event.geometry.coordinates,
            zoom: 14,
            speed: 1,
            curve: 1,
            bearing: 0
        });
        this.getBodenrichtwertzonen(event.geometry.coordinates[1], event.geometry.coordinates[0], 'B');
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
            zoom: 14,
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
        console.log(this.isCollapsed);
        this.map.resize();

        if (this.threeDActive) {
            this.deactivate3dView();
        }

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
                this.getBodenrichtwertzonen(lngLat.lat, lngLat.lng, 'B');
            });
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
