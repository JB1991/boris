import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GeolocateControl, LngLat, LngLatBounds, Map, ScaleControl, MapMouseEvent, MapTouchEvent, Marker, NavigationControl, VectorSource, GeoJSONSource } from 'maplibre-gl';
import BodenrichtwertKartePitchControl from '@app/bodenrichtwert/bodenrichtwert-karte/bodenrichtwert-karte-pitch-control';
import { environment } from '@env/environment';
import { Teilmarkt } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { Polygon } from 'geojson';
import { DynamicLabellingService } from './dynamic-labelling.service';
import { BodenrichtwertKarteService } from './bodenrichtwert-karte.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

/* eslint-disable max-lines */
@Component({
    selector: 'power-bodenrichtwertkarte',
    templateUrl: './bodenrichtwert-karte.component.html',
    styleUrls: ['./bodenrichtwert-karte.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertKarteComponent implements OnChanges, AfterViewInit {

    @ViewChild('map')
    public mapContainer?: ElementRef<HTMLElement>;

    // Maplibre GL Map Object
    public map: Map;

    // baseUrl
    public baseUrl = environment.baseurl;

    // map style url
    public MAP_STYLE_URL = environment.basemap;

    // font
    // public font = 'Klokantech Noto Sans Regular';

    // NDS Bounds Maplibre Type
    public bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);

    // Maplibre GL Marker
    public marker: Marker = new Marker({
        color: '#c4153a',
        draggable: true
    }).on('dragend', () => {
        this.onDragEnd();
    });

    // Bremen - Tile Source, Bounds, Source
    public brBounds = [8.483772095325497, 53.01056958991861, 8.990848892958946, 53.61043564706235];

    public brTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=boris:br_brzone_flat_bremen_with_display'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public bremenSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.brTiles],
        bounds: this.brBounds,
    };

    // NDS - Tile Sources, Bounds, Source
    public ndsBounds = [6.19523325024787, 51.2028429493903, 11.7470832174838, 54.1183357191213];

    // Bodenrichtwerte
    public ndsTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=boris:br_brzone_flat_with_display'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public ndsSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.ndsTiles],
        bounds: this.ndsBounds,
    };

    // Sanierungsgebiete - Verg (Verfahrensgrundlage)
    public ndsVergTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=boris:br_verfahren'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public ndsVergSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.ndsVergTiles],
        bounds: this.ndsBounds,
    };

    // Flurstuecke
    public ndsFstTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=alkis:ax_flurstueck_nds'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public ndsFstSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.ndsFstTiles],
        bounds: this.ndsBounds,
    };

    @Input() public latLng: LngLat;
    @Output() public latLngChange = new EventEmitter<LngLat>();

    @Input() public teilmarkt?: Teilmarkt;

    @Input() public stichtag?: string;

    @Input() public isCollapsed?: boolean;
    @Output() public isCollapsedChange = new EventEmitter();

    @Input() public expanded?: boolean;

    @Input() public collapsed?: boolean;

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

    constructor(
        public alerts: AlertsService,
        private dynamicLabellingService: DynamicLabellingService,
        private mapService: BodenrichtwertKarteService
    ) { }

    /** @inheritdoc */
    ngOnChanges(changes: SimpleChanges) { // eslint-disable-line complexity
        if (!this.map) {
            return;
        }
        // Teilmarkt changed
        if (changes['teilmarkt'] && !changes['teilmarkt'].firstChange && !this.resetMapFired) {
            this.changedTeilmarkt();
        }
        // Stichtag changed
        if (changes['stichtag'] && !changes['stichtag'].firstChange) {
            this.changedStichtag();
        }
        // latLng changed
        if (changes['latLng'] && changes['latLng'].currentValue !== undefined) {
            this.changedLatLng();
        }
        // collapsed
        if (changes['collapsed']) {
            this.changedCollapsed();
        }
        // expanded
        if (changes['expanded'] && this.latLng
            && changes['expanded'].currentValue) {
            this.fly();
        }
        // resetMapFired triggered by navigation resetMap only if details are collapsed
        if (changes['resetMapFired'] && !changes['resetMapFired'].firstChange) {
            if (changes['resetMapFired'].currentValue && this.collapsed) {
                this.onResetMap();
            } else {
                // resizes the map canvas to full display width
                this.map.resize();
            }
        }
        // 3D-Modus temporarly deactivated (WIP)
        // if (changes.features && !changes.features.firstChange) {
        //     this.bodenrichtwert3DLayer.onFeaturesChange(changes.features,
        //         this.map, this.stichtag, this.teilmarkt);
        // }
    }

    /**
     * changedTeilmarkt
     */
    private changedTeilmarkt() {
        // update layer
        this.map.setLayoutProperty('bauland', 'visibility', this.teilmarkt?.value.includes('B') ? 'visible' : 'none');
        this.map.setLayoutProperty('sanierungsgebiet', 'visibility', this.teilmarkt?.value.includes('B') ? 'visible' : 'none');
        this.map.setLayoutProperty('landwirtschaft', 'visibility', this.teilmarkt?.value.includes('LF') ? 'visible' : 'none');
        this.map.setLayoutProperty('bauland_bremen', 'visibility', this.teilmarkt?.value.includes('B') ? 'visible' : 'none');
        this.map.setLayoutProperty('sanierungsgebiet_bremen', 'visibility', this.teilmarkt?.value.includes('B') ? 'visible' : 'none');
        this.map.setLayoutProperty('landwirtschaft_bremen', 'visibility', this.teilmarkt?.value.includes('LF') ? 'visible' : 'none');

        this.map.easeTo({
            zoom: this.zoom,
            center: this.latLng ? [this.latLng.lng, this.latLng.lat] : this.map.getCenter()
        });
    }

    /**
     * changedStichtag
     */
    private changedStichtag() {
        // update layer
        this.map.setFilter('bauland', ['all', ['in', 'entw', 'B', 'SF', 'R', 'E'], ['==', 'stag', this.stichtag]]);
        this.map.setFilter('sanierungsgebiet', ['==', 'stag', this.stichtag]);
        this.map.setFilter('landwirtschaft', ['all', ['==', 'entw', 'LF'], ['==', 'stag', this.stichtag]]);
        this.map.setFilter('bauland_bremen', ['all', ['in', 'entw', 'B', 'SF', 'R', 'E'], ['==', 'stag', this.stichtag]]);
        this.map.setFilter('sanierungsgebiet_bremen', ['all', ['in', 'verg', 'San', 'SoSt', 'Entw', 'StUb'], ['==', 'stag', this.stichtag]]);
        this.map.setFilter('landwirtschaft_bremen', ['all', ['==', 'entw', 'LF'], ['==', 'stag', this.stichtag]]);

        // needed to update labeling
        this.map.easeTo({
            zoom: this.map.getZoom()
        });
    }

    /**
     * changedLatLng
     */
    private changedLatLng() {
        this.marker.setLngLat(this.latLng).addTo(this.map);
        if (this.expanded) {
            this.fly();
        }
    }

    /**
     * changedCollapsed
     */
    private changedCollapsed() {
        this.map.resize();
        // resetMap only if details was expanded
        if (this.resetMapFired) {
            this.onResetMap();
        }
    }

    /** @inheritdoc */
    ngAfterViewInit() {
        // create Maplibre object
        try {
            this.map = new Map({
                container: this.mapContainer?.nativeElement,
                style: this.MAP_STYLE_URL,
                zoom: 7,
                transformRequest: this.transformRequest,
                bounds: this.bounds,
                maxZoom: 18,
                minZoom: 5,
                trackResize: true,
                preserveDrawingBuffer: true
            });
            this.mapService.map = this.map;
            this.mapService.marker = this.marker;

            // add load handler
            this.map.on('load', () => {
                this.loadMap();
            });
        } catch (error) {
            // WebGL missing
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Karte laden fehlgeschlagen`, $localize`Bitte überprüfen Sie die WebGL Unterstützung von Ihrem Webbrowser.`);
        }
    }

    /* istanbul ignore next */
    /**
     * loadMap initializes the Maplibre GL map object
     */
    public loadMap() {
        this.map.addSource('ndsgeojson', { type: 'geojson', data: this.baseUrl + '/assets/boden/niedersachsen.geojson' });
        this.map.addSource('baulandSource', {
            type: 'geojson', data: {
                type: 'FeatureCollection',
                features: []
            }
        });
        this.map.addSource('landwirtschaftSource', {
            type: 'geojson', data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        this.map.addSource('geoserver_br_br', this.bremenSource);
        this.map.addSource('geoserver_nds_br', this.ndsSource);
        this.map.addSource('geoserver_nds_fst', this.ndsFstSource);
        this.map.addSource('geoserver_br_verg', this.ndsVergSource);

        this.map.addLayer({
            id: 'nds',
            type: 'line',
            maxzoom: 11,
            source: 'ndsgeojson',
            paint: {
                'line-color': '#c4153a',
                'line-width': {
                    'stops': [[8, 1], [11, 1]]
                },
                'line-opacity': {
                    'stops': [[8, 1], [11, 1]]
                }
            }
        });
        this.map.addLayer({
            id: 'building-extrusion',
            type: 'fill-extrusion',
            minzoom: 15,
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
        this.map.addLayer({
            id: 'flurstuecke',
            type: 'line',
            minzoom: 15,
            source: this.ndsFstSource,
            'source-layer': 'ax_flurstueck_nds',
            paint: {
                'line-color': '#96999e',
                'line-width': {
                    'stops': [[15, 0], [16, 1], [18, 2]]
                },
                'line-opacity': {
                    'stops': [[15, 0.5]]
                }
            }
        });
        this.map.addLayer({
            id: 'bauland',
            type: 'line',
            minzoom: 11,
            source: this.ndsSource,
            'source-layer': 'br_brzone_flat_with_display',
            paint: {
                'line-color': '#c4153a',
                'line-width': {
                    'stops': [[11, 0], [13, 1], [18, 2]]
                },
                'line-opacity': {
                    'stops': [[11, 0], [13, 1]]
                }
            },
            layout: this.teilmarkt?.value.includes('B') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['all', ['in', 'entw', 'B', 'SF', 'R', 'E'], ['==', 'stag', this.stichtag]]
        });
        this.map.addLayer({
            id: 'sanierungsgebiet',
            type: 'line',
            minzoom: 11,
            source: this.ndsVergSource,
            'source-layer': 'br_verfahren',
            paint: {
                'line-color': '#0080FF',
                'line-dasharray': [7, 5],
                'line-width': {
                    'stops': [[11, 0], [13, 2], [18, 4]]
                },
                'line-opacity': {
                    'stops': [[11, 0], [13, .6]]
                }
            },
            layout: this.teilmarkt?.value.includes('B') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['==', 'stag', this.stichtag]
        });
        this.map.addLayer({
            id: 'landwirtschaft',
            type: 'line',
            minzoom: 10,
            source: this.ndsSource,
            'source-layer': 'br_brzone_flat_with_display',
            paint: {
                'line-color': '#009900',
                'line-width': {
                    'stops': [[8, 0], [10, 1], [11, 2]]
                },
                'line-opacity': {
                    'stops': [[8, 0], [10, 1]]
                }
            },
            layout: this.teilmarkt?.value.includes('LF') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['all', ['==', 'entw', 'LF'], ['==', 'stag', this.stichtag]]
        });
        this.map.addLayer({
            id: 'bauland_labels',
            type: 'symbol',
            source: 'baulandSource',
            minzoom: 11,
            paint: {
                'text-halo-color': '#fff',
                'text-halo-width': 2,
                'text-halo-blur': 2,
                'text-color': '#c4153a'
            },
            layout: {
                'visibility': 'visible',
                'text-field': ['get', 'display'],
                'text-max-width': 0,
                'text-size': {
                    'stops': [[12, 10], [15, 16]]
                },
                'text-font': ['Cantarell Regular']
            }
        });
        this.map.addLayer({
            id: 'landwirtschaft_labels',
            type: 'symbol',
            source: 'landwirtschaftSource',
            paint: {
                'text-halo-color': '#fff',
                'text-halo-width': 2,
                'text-halo-blur': 2,
                'text-color': '#009900'
            },
            layout: {
                'visibility': 'visible',
                'text-field': ['get', 'display'],
                'text-max-width': 0,
                'text-size': {
                    'stops': [[10, 20], [15, 24]]
                },
                'text-font': ['Cantarell Regular']
            }
        });


        this.map.addLayer({
            id: 'bauland_bremen',
            type: 'line',
            minzoom: 11,
            source: this.bremenSource,
            'source-layer': 'br_brzone_flat_bremen_with_display',
            paint: {
                'line-color': '#c4153a',
                'line-width': {
                    'stops': [[11, 0], [13, 1], [18, 2]]
                },
                'line-opacity': {
                    'stops': [[11, 0], [13, 1]]
                }
            },
            layout: this.teilmarkt?.value.includes('B') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['all', ['in', 'entw', 'B', 'SF', 'R', 'E'], ['==', 'stag', this.stichtag]]
        });
        this.map.addLayer({
            id: 'sanierungsgebiet_bremen',
            type: 'line',
            minzoom: 11,
            source: this.bremenSource,
            'source-layer': 'br_brzone_flat_bremen_with_display',
            paint: {
                'line-color': '#0080FF',
                'line-dasharray': [7, 5],
                'line-width': {
                    'stops': [[11, 0], [13, 2], [18, 4]]
                },
                'line-opacity': {
                    'stops': [[11, 0], [13, .6]]
                }
            },
            layout: this.teilmarkt?.value.includes('B') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['all', ['in', 'verg', 'San', 'SoSt', 'Entw', 'StUb'], ['==', 'stag', this.stichtag]]
        });
        this.map.addLayer({
            id: 'landwirtschaft_bremen',
            type: 'line',
            minzoom: 10,
            source: this.bremenSource,
            'source-layer': 'br_brzone_flat_bremen_with_display',
            paint: {
                'line-color': '#009900',
                'line-width': {
                    'stops': [[8, 0], [10, 1], [11, 2]]
                },
                'line-opacity': {
                    'stops': [[8, 0], [10, 1]]
                }
            },
            layout: this.teilmarkt?.value.includes('LF') ? { visibility: 'visible' } : { visibility: 'none' },
            filter: ['all', ['==', 'entw', 'LF'], ['==', 'stag', this.stichtag]]
        });

        // add scale
        const scale = new ScaleControl({
            unit: 'metric'
        });
        this.map.addControl(scale, 'bottom-left');

        // add navigation control
        const navControl = new NavigationControl({
            visualizePitch: true
        });
        this.map.addControl(navControl, 'top-right');

        // add geolocation control
        const geolocateControl = new GeolocateControl({
            showUserLocation: false
        });
        this.map.addControl(geolocateControl, 'top-right');
        geolocateControl.on('geolocate', (evt: GeolocationPosition) => {
            if (this.zoom && this.zoom < this.determineZoomFactor()) {
                this.zoomChange.emit(this.determineZoomFactor());
            }
            this.latLngChange.emit(new LngLat(evt.coords.longitude, evt.coords.latitude));
        });

        const pitchControl = new BodenrichtwertKartePitchControl(this.marker);
        this.map.addControl(pitchControl, 'top-right');

        // update the map on reload if coordinates exist
        if (this.latLng) {
            this.map.resize();
            this.marker.setLngLat(this.latLng).addTo(this.map);
            this.fly();
        }

        // add handler
        this.map.on('click', (event: MapMouseEvent) => {
            this.onMapClickEvent(event);
        });
        this.map.on('moveend', () => {
            this.relabel();
        });
        this.map.on('rotateend', () => {
            this.onRotate();
        });
        this.map.on('zoomend', () => {
            this.onZoomEnd();
        });
        this.map.on('pitchend', () => {
            this.onPitchEnd();
        });
    }

    /**
     * onZoomEnd emits the current zoom level onZoomEnd
     */
    public onZoomEnd() {
        this.zoomChange.emit(this.map.getZoom());
    }

    /**
     * onPitchEnd emits the current pitch onPitchEnd
     */
    public onPitchEnd() {
        this.pitchChange.emit(this.map.getPitch());
    }

    /**
     * onRotate emits the current rotation level onRotate
     */
    public onRotate() {
        this.pitchChange.emit(this.map.getPitch());
        this.bearingChange.emit(this.map.getBearing());

        // 3D-Layer temporarly deactivated
        // this.bodenrichtwert3DLayer.onRotate(this.features, this.map, this.stichtag, this.teilmarkt);
    }

    /**
     * determineZoomFactor determines the zoom depending on current zoomlvl and teilmarkt
     * @returns returns zoom level depending on selected teilmarkt
     */
    public determineZoomFactor(): number {
        // Bauland
        if (this.standardBaulandZoom && this.teilmarkt?.text === 'Bauland') {
            return this.standardBaulandZoom;
            // Landwirtschaft
        } else if (this.standardLandZoom) {
            return this.standardLandZoom;
        }
        return -1;
    }

    /**
     * flyTo executes a flyTo for a given latLng
     */
    public fly() {
        this.map.flyTo({
            center: [this.latLng.lng, this.latLng.lat],
            zoom: this.zoom,
            speed: 1,
            curve: 1,
            bearing: this.bearing,
            pitch: this.pitch
        });
    }

    /**
     * onDragEnd updates latLng if marker was moved
     */
    public onDragEnd(): void {
        this.latLngChange.emit(this.marker.getLngLat());
    }

    /**
     * onMapClickEvent updates latLng for the clicked location
     * @param event MapEvent with coordinates
     */
    public onMapClickEvent(event: MapMouseEvent | MapTouchEvent): void {
        if (this.zoom && this.zoom < this.determineZoomFactor()) {
            this.zoomChange.emit(this.determineZoomFactor());
        }
        if (event.lngLat) {
            this.latLngChange.emit(event.lngLat);
        }
    }

    /**
     * onResetMap updates the marker and map bounds if resetMapFired was triggered
     */
    public onResetMap(): void {
        if (this.marker) {
            this.marker.setLngLat([null, null]);
            this.marker.remove();
        }

        this.map.fitBounds(this.bounds, {
            pitch: this.pitch,
            bearing: this.bearing
        });

        if (this.map.getLayer('building-extrusion')) {
            this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
        }
        this.resetMapFiredChange.emit(false);
    }

    /**
     * relabel
     */
    public relabel() {
        const mapSW = this.map.getBounds().getSouthWest();
        const mapNE = this.map.getBounds().getNorthEast();

        const mapViewBound: Polygon = {
            type: 'Polygon',
            coordinates: [
                [
                    [mapSW.lng, mapSW.lat],
                    [mapSW.lng, mapNE.lat],
                    [mapNE.lng, mapNE.lat],
                    [mapNE.lng, mapSW.lat],
                    [mapSW.lng, mapSW.lat]
                ]
            ]
        };

        const landwirtschaftsSource = this.map.getSource('landwirtschaftSource') as GeoJSONSource;
        const baulandSource = this.map.getSource('baulandSource') as GeoJSONSource;

        if (this.teilmarkt?.value.includes('B') && baulandSource) {

            if (landwirtschaftsSource) {
                landwirtschaftsSource.setData({
                    type: 'FeatureCollection',
                    features: []
                });
            }

            const features = this.dynamicLabellingService.dynamicLabelling(
                this.map.queryRenderedFeatures(null, { layers: ['bauland', 'bauland_bremen'] }),
                mapViewBound,
                (f) => f.properties?.['objektidentifikator'],
                (f) => f.properties?.['wnum'],
                [
                    '04307171'
                ],
                this.dynamicLabellingService.generatePointFeatures([
                    // wnum: 04307171 - ASB Umring Langenhagen
                    { lat: 52.4333645400087, lng: 9.698011330059643, properties: { display: 130 } },
                    { lat: 52.43821616734934, lng: 9.656380976422724, properties: { display: 130 } },
                    { lat: 52.45547417953654, lng: 9.673021529653596, properties: { display: 130 } },
                    { lat: 52.46679714990489, lng: 9.719547336560112, properties: { display: 130 } },
                    { lat: 52.4723241988992, lng: 9.7557494003822, properties: { display: 130 } },
                    { lat: 52.43336837635533, lng: 9.715375393126635, properties: { display: 130 } },
                    { lat: 52.48606574248538, lng: 9.726679369115345, properties: { display: 130 } },
                ]));
            baulandSource.setData({
                type: 'FeatureCollection',
                features: features,
            });
        } else if (landwirtschaftsSource) {

            if (baulandSource && baulandSource.type === 'geojson') {
                baulandSource.setData({
                    type: 'FeatureCollection',
                    features: []
                });
            }

            const features = this.dynamicLabellingService.dynamicLabelling(
                this.map.queryRenderedFeatures(null, { layers: ['landwirtschaft', 'landwirtschaft_bremen'] }),
                mapViewBound,
                f => f.properties?.['objektidentifikator'],
                () => '',
                [],
                []);
            landwirtschaftsSource.setData({
                type: 'FeatureCollection',
                features: features,
            });
        }
    }

    /**
     * transformRequest
     * @param url url
     * @param resourceType resourceType
     * @returns returns transformed url
     */
    public transformRequest(url: string, resourceType: string) {
        if (!url.startsWith('http') && resourceType === 'Tile') {
            return { url: location.protocol + '//' + location.host + url };
        }
        return { url: url };
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
