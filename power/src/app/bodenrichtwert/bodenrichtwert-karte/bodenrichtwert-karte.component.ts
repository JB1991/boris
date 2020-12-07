import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { LngLat, LngLatBounds, Map, Marker, VectorSource } from 'mapbox-gl';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { environment } from '@env/environment';
import { STICHTAGE, TEILMAERKTE } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Flurstueck } from '@app/shared/flurstueck-search/flurstueck-search.component';

/* eslint-disable max-lines */
@Component({
    selector: 'power-bodenrichtwertkarte',
    templateUrl: './bodenrichtwert-karte.component.html',
    styleUrls: ['./bodenrichtwert-karte.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertKarteComponent implements OnInit, OnChanges {

    public searchActive = false;
    public filterActive = false;
    public threeDActive = false;

    public isDragged = false;
    public previousZoomFactor: number;

    public baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    // Bremen - Tile Source
    public brTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=boris:br_brzone_flat_bremen_with_whitespace'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public brBounds = [8.483772095325497, 53.01056958991861, 8.990848892958946, 53.61043564706235];

    public bremenSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.brTiles],
        bounds: this.brBounds,
    };

    // NDS - Tile Source
    public ndsTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=boris:br_brzone_flat_with_whitespace'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public ndsBounds = [6.19523325024787, 51.2028429493903, 11.7470832174838, 54.1183357191213];

    public ndsSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.ndsTiles],
        bounds: this.ndsBounds,
    };

    public MAP_STYLE_URL = environment.basemap;

    public map: Map;
    public bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);

    public marker: Marker = new Marker({
        color: '#c4153a',
        draggable: true
    }).on('dragstart', () => {
        this.isDragged = !this.isDragged;
    });
    public zoom = 18;

    public lat: number;
    public lng: number;

    @Input() teilmarkt: any;
    @Output() teilmarktChange = new EventEmitter();

    public TEILMAERKTE = TEILMAERKTE;

    @Input() stichtag;
    @Output() stichtagChange = new EventEmitter();

    public STICHTAGE = STICHTAGE;

    @Input() isCollapsed;
    @Output() isCollapsedChange = new EventEmitter();

    @Input() expanded;

    @Input() collapsed;

    @Input() adresse;
    @Output() adresseChange = new EventEmitter();

    @Input() features;
    @Output() featuresChange = new EventEmitter();

    @Input() flurstueck: Flurstueck;

    public resetMapFired = false;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public geosearchService: GeosearchService,
        private route: ActivatedRoute,
        private location: Location,
        private cdr: ChangeDetectorRef,
        public alerts: AlertsService
    ) { }

    /* eslint-disable-next-line complexity */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.isCollapsed && this.map) {
            this.map.resize();
            this.flyTo(this.marker.getLngLat().lat, this.marker.getLngLat().lng);
            if (this.resetMapFired) {
                this.map.fitBounds(this.bounds, {
                    pitch: 0,
                    bearing: 0
                });
                this.resetMapFired = !this.resetMapFired;
            }
        } else if ((changes.collapsed || changes.expanded || changes.adresse) && this.map) {
            this.map.resize();
        } else if (changes.flurstueck && this.flurstueck && this.map) {
            this.onFlurstueckChange();
        }
    }

    ngOnInit() {
    }

    /**
     * Update Address, BRZ, Marker, Map, URL onFlurstueckChange
     */
    public onFlurstueckChange() {
        const lat = this.flurstueck.bbox[1];
        const lon = this.flurstueck.bbox[0];
        this.marker.setLngLat([lon, lat]).addTo(this.map);
        this.getAddressFromLatLng(lat, lon);
        this.getBodenrichtwertzonen(lat, lon, this.teilmarkt.value);
        this.flyTo(lat, lon);
        this.changeURL();
    }

    loadMap(event: Map) {
        this.map = event;

        this.map.addSource('geoserver_br', this.bremenSource);

        this.map.addSource('geoserver_nds', this.ndsSource);

        this.route.queryParams.subscribe(params => {
            // lat and lat
            if (params['lat'] && params['lng']) {
                this.lat = params['lat'];
                this.lng = params['lng'];
                this.marker.setLngLat([this.lng, this.lat]).addTo(this.map);
                this.getAddressFromLatLng(this.lat, this.lng);
                this.flyTo(this.lat, this.lng);
            }

            // teilmarkt
            if (params['teilmarkt']) {
                const tmp = TEILMAERKTE.filter(p => p.viewValue === params['teilmarkt'])[0];
                if (tmp) {
                    this.onTeilmarktChange(tmp);
                }
            }

            // stichtag
            if (params['stichtag']) {
                if (STICHTAGE.includes(params['stichtag'])) {
                    this.onStichtagChange(params['stichtag']);
                }
            }
            this.cdr.detectChanges();

        });
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }

    toggleFilterActive() {
        this.filterActive = !this.filterActive;
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
            .subscribe(
                res => this.bodenrichtwertService.updateFeatures(res),
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    getAddressFromLatLng(lat: number, lng: number) {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(
                res => this.geosearchService.updateFeatures(res.features[0]),
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    onDragEnd() {
        if (this.marker.getLngLat() && this.isDragged) {
            this.lat = this.marker.getLngLat().lat;
            this.lng = this.marker.getLngLat().lng;

            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
            this.getAddressFromLatLng(this.lat, this.lng);
            this.flyTo(this.lat, this.lng);
            this.changeURL();
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
            this.changeURL();
        }
    }

    onSearchSelect(event: any) {
        this.marker.setLngLat(event.geometry.coordinates).addTo(this.map);
        this.lat = event.geometry.coordinates[1];
        this.lng = event.geometry.coordinates[0];
        this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        this.getAddressFromLatLng(this.lat, this.lng);
        this.flyTo(this.lat, this.lng);
        this.changeURL();
    }

    toggle3dView() {
        if (!this.threeDActive) {
            this.activate3dView();
        } else if (this.threeDActive) {
            this.deactivate3dView();
        }
        this.threeDActive = !this.threeDActive;
        this.changeURL();
    }

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
        this.changeURL();
    }

    onTeilmarktChange(teilmarkt: any) {
        this.teilmarkt = teilmarkt;
        this.teilmarktChange.emit(this.teilmarkt);
        this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        this.changeURL();
    }

    public resetMap() {
        this.resetMapFired = true;
        this.location.replaceState('/bodenrichtwerte');
        if (this.threeDActive) {
            this.deactivate3dView();
            this.threeDActive = !this.threeDActive;
        }
        if (this.marker) {
            this.marker.remove();
        }
        if (this.adresse) {
            this.adresseChange.emit(undefined);
        }
        if (this.features) {
            this.featuresChange.emit(false);
        }
        if (!this.isCollapsed) {
            this.isCollapsedChange.emit(true);
        }
        this.map.resize();
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
                this.lat = lngLat.lat;
                this.lng = lngLat.lng;
                this.marker.setLngLat(lngLat).addTo(this.map);
                this.getAddressFromLatLng(this.lat, this.lng);
                this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
                this.changeURL();
            });
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
