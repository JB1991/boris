import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { LngLatBounds, Map, MapMouseEvent, MapTouchEvent, Marker, VectorSource } from 'mapbox-gl';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { BodenrichtwertKarte3dLayerService } from '@app/bodenrichtwert/bodenrichtwert-karte/bodenrichtwert-karte-3d-layer.service';
import { environment } from '@env/environment';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';

type Polygon = {
    type: 'Polygon';
    coordinates: number[][][];
};

type MultiPolygon = {
    type: 'MultiPolygon';
    coordinates: number[][][][];
};

function getLargestPolygon(mp: MultiPolygon): Polygon {
    let area = 0;
    let largest: Polygon;
    mp.coordinates.forEach(c => {
        const p = {
            type: 'Polygon',
            coordinates: c,
        };
        const a = turf.area(p);
        if (!largest || a > area) {
            if (a > area) {
                area = a;
                largest = {
                    type: 'Polygon',
                    coordinates: p.coordinates,
                };
            }
        }
    });
    return largest;
}

/* eslint-disable max-lines */
@Component({
    selector: 'power-bodenrichtwertkarte',
    templateUrl: './bodenrichtwert-karte.component.html',
    styleUrls: ['./bodenrichtwert-karte.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertKarteComponent implements OnChanges {

    // zoomFactor
    public zoomFactor: number;

    // Flurstuecke become visible at Zoomfactor 15.1
    public standardBaulandZoom = 15.1;
    public standardLandZoom = 11;

    // Mapbox GL Map Object
    public map: Map;

    // baseUrl
    public baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    // map style url
    public MAP_STYLE_URL = environment.basemap;

    // NDS Bounds MapBox Type
    public bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);

    // Mapbox GL Marker
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

    public baulandData: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    public landwirtschaftData: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    @Input() latLng: Array<number>;
    @Output() latLngChange = new EventEmitter<Array<number>>();

    @Input() teilmarkt: Teilmarkt;

    @Input() stichtag: string;

    @Input() isCollapsed: boolean;
    @Output() isCollapsedChange = new EventEmitter();

    @Input() expanded: boolean;

    @Input() collapsed: boolean;

    @Input() resetMapFired: boolean;
    @Output() resetMapFiredChange = new EventEmitter<boolean>();

    @Input() threeDActive: boolean;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public bodenrichtwert3DLayer: BodenrichtwertKarte3dLayerService,
        public geosearchService: GeosearchService,
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService,
    ) { }

    /* eslint-disable-next-line complexity */
    ngOnChanges(changes: SimpleChanges) {
        if (this.map) {
            // Teilmarkt changed
            if (changes.teilmarkt && !changes.teilmarkt.firstChange && !this.resetMapFired) {
                this.determineZoomFactor();
                this.map.easeTo({
                    zoom: this.zoomFactor,
                    center: this.latLng.length ? [this.latLng[1], this.latLng[0]] : this.map.getCenter()
                });
            }
            // Stichtag changed
            if (changes.stichtag && !changes.stichtag.firstChange) {
                // needed to update labeling
                this.map.easeTo({
                    zoom: this.map.getZoom()
                });
            }
            // latLng changed
            if (changes.latLng && changes.latLng.currentValue !== undefined) {
                this.marker.setLngLat([this.latLng[1], this.latLng[0]]).addTo(this.map);
                if (this.expanded) {
                    this.flyTo(this.latLng[0], this.latLng[1]);
                }
            }
            // collapsed
            if (changes.collapsed) {
                this.map.resize();
                // resetMap only if details was expanded
                if (this.resetMapFired) {
                    this.onResetMap();
                }
            }
            // expanded
            if (changes.expanded && this.latLng) {
                if (changes.expanded.currentValue) {
                    this.flyTo(this.latLng[0], this.latLng[1]);
                }
            }
            // resetMapFired triggered by navigation resetMap only if details are collapsed
            if (changes.resetMapFired && !changes.resetMapFired.firstChange) {
                if (changes.resetMapFired.currentValue && this.collapsed) {
                    this.onResetMap();
                } else {
                    // resizes the map canvas to full display width
                    this.map.resize();
                }
            }
            // threeDActive
            if (changes.threeDActive?.currentValue) {
                this.activate3dView();
            } else if (changes.threeDActive?.currentValue === false && !changes.threeDActive?.firstChange) {
                this.deactivate3dView();
            }
            // 3D-Modus temporarly deactivated (WIP)
            // if (changes.features && !changes.features.firstChange) {
            //     this.bodenrichtwert3DLayer.onFeaturesChange(changes.features, this.map, this.stichtag, this.teilmarkt);
            // }
        }
    }

    /**
     * loadMap initializes the Mapbox GL map object
     * @param event 
     */
    public loadMap(event: Map) {
        this.map = event;

        this.map.addSource('geoserver_br_br', this.bremenSource);

        this.map.addSource('geoserver_nds_br', this.ndsSource);

        this.map.addSource('geoserver_nds_fst', this.ndsFstSource);

        // update the map on reload if coordinates exist
        if (this.latLng.length) {
            this.map.resize();
            this.marker.setLngLat([this.latLng[1], this.latLng[0]]).addTo(this.map);
            this.flyTo(this.latLng[0], this.latLng[1]);
        }
    }

    /**
     * determineZoomFactor determines the zoom depending on current zoomlvl and teilmarkt
     */
    private determineZoomFactor() {
        const currentZoom = this.map.getZoom();
        // Landwirtschaft
        if (this.teilmarkt.text !== 'Bauland') {
            this.zoomFactor = this.standardLandZoom;
            // if (currentZoom > 10) {
            //     this.zoomFactor = currentZoom;
            // } else {
            //     this.zoomFactor = this.standardLandZoom;
            // }
            // Bauland
            // } else if (currentZoom > 11) {
            // this.zoomFactor = currentZoom;
        } else {
            this.zoomFactor = this.standardBaulandZoom;
        }
    }

    /**
     * flyTo executes a flyTo for a given latLng
     */
    private flyTo(lat: number, lng: number) {
        this.determineZoomFactor();
        this.map.flyTo({
            center: [lng, lat],
            zoom: this.zoomFactor,
            speed: 1,
            curve: 1,
            bearing: 0
        });
    }

    /**
     * onDragEnd updates latLng if marker was moved
     */
    public onDragEnd(): void {
        const lat = this.marker.getLngLat().lat;
        const lng = this.marker.getLngLat().lng;
        this.latLngChange.emit([lat, lng]);
    }

    /**
     * onMapClickEvent updates latLng for the clicked location
     * @param event MapEvent with coordinates
     */
    public onMapClickEvent(event: MapMouseEvent | MapTouchEvent): void {
        if (event.lngLat) {
            this.latLngChange.emit([event.lngLat.lat, event.lngLat.lng]);
        }
    }

    /**
     * onResetMap updates the marker and map bounds if resetMapFired was triggered
     */
    private onResetMap(): void {
        if (this.marker) {
            this.marker.setLngLat([null, null]);
            this.marker.remove();
        }

        this.map.fitBounds(this.bounds, {
            pitch: 0,
            bearing: 0
        });
        this.resetMapFiredChange.emit(false);
    }

    // temporarly deactivated
    /**
     * onRotate updates the 3D-Layer on rotations
     */
    public onRotate() {
        // this.bodenrichtwert3DLayer.onRotate(this.features, this.map, this.stichtag, this.teilmarkt);
    }

    // list of ids where the label shouldn't be displayed
    doNotDisplay = [
        'DENIBR4319B07171',
        'DENIBR4316B37171',
        'DENIBR4318B07171',
        'DENIBR4315B37171',
        'DENIBR4317B37171',
        'DENIBR4314B37171',
        'DENIBR4313B37171',
        'DENIBR4320B07171'
    ];

    /**
     * onMoveEnd
     */
    public onMoveEnd() {
        if (this.map) {
            if (this.teilmarkt.value.includes('B')) {

                this.landwirtschaftData.features = [];
                const source = this.map.getSource('landwirtschaftSource');
                if (source.type === 'geojson') {
                    source.setData(this.landwirtschaftData);
                }

                this.dynamicLabelling(this.baulandData, ['bauland', 'bauland_bremen'], 'baulandSource');
            } else {

                this.baulandData.features = [];
                const source = this.map.getSource('baulandSource');
                if (source.type === 'geojson') {
                    source.setData(this.baulandData);
                }

                this.dynamicLabelling(this.landwirtschaftData, ['landwirtschaft', 'landwirtschaft_bremen'], 'landwirtschaftSource');
            }
        }
    }

    /**
     * dynamicLabelling
     * @param labelData 
     * @param layerNames 
     * @param sourceName 
     */
    private dynamicLabelling(labelData: FeatureCollection, layerNames: string[], sourceName: string) {
        labelData.features = [];

        const featureMap: Record<string, GeoJSON.Feature<Polygon>[]> = {};

        const mapSW = this.map.getBounds().getSouthWest();
        const mapNE = this.map.getBounds().getNorthEast();

        const mapViewBound = [
            [
                [mapSW.lng, mapSW.lat],
                [mapSW.lng, mapNE.lat],
                [mapNE.lng, mapNE.lat],
                [mapNE.lng, mapSW.lat],
                [mapSW.lng, mapSW.lat]
            ]
        ];

        this.map.queryRenderedFeatures(null, { layers: layerNames }).forEach(f => {
            const oid = f.properties['objektidentifikator'];
            if (this.doNotDisplay.includes(oid)) {
                return;
            };
            if (f && f.type === 'Feature') {
                if (f.geometry.type === 'MultiPolygon') {
                    f.geometry = getLargestPolygon(f.geometry);
                }
                if (f.geometry.type === 'Polygon') {
                    if (featureMap[f.properties.objektidentifikator]) {
                        featureMap[f.properties.objektidentifikator].push({
                            type: 'Feature',
                            geometry: f.geometry,
                            properties: f.properties,
                        });
                    } else {
                        featureMap[f.properties.objektidentifikator] = [{
                            type: 'Feature',
                            geometry: f.geometry,
                            properties: f.properties,
                        }];
                    }
                } else {
                    console.log('missing type case: ' + f.geometry.type);
                }
            } else {
                console.log('empty feature');
            }
        });

        const features: Array<GeoJSON.Feature<GeoJSON.Geometry>> = Object.keys(featureMap).map(key => {
            const properties = featureMap[key][0].properties;
            let union: Polygon;

            if (featureMap[key].length === 1) {
                union = featureMap[key][0].geometry;
            } else {

                featureMap[key].forEach(f => {
                    if (union) {
                        const u = turf.union(union, f.geometry);
                        switch (u.geometry.type) {
                            case 'Polygon':
                                union = u.geometry;
                                break;
                            case 'MultiPolygon':
                                union = getLargestPolygon(u.geometry);
                                break;
                        };
                    } else {
                        union = f.geometry;
                    }
                });
            };

            const featureView = turf.intersect({
                type: 'Polygon',
                coordinates: mapViewBound,
            }, union);
            if (!featureView) {
                console.log('no featureView: ' + properties['display']);
                return {
                    type: 'Feature',
                    geometry: union,
                    properties: properties,
                };
            }

            return {
                type: 'Feature',
                geometry: featureView.geometry,
                properties: properties,
            };
        });

        labelData.features = features;

        const source = this.map.getSource(sourceName);
        if (source.type === 'geojson') {
            source.setData(labelData);
        }
    }

    /**
     * activate3dView adds a building transition layer to the map
     */
    private activate3dView() {
        this.zoomFactor = this.map.getZoom();
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

    /**
     * deactivate3dView removes the building extrusion layer from the map 
     */
    private deactivate3dView() {
        this.map.easeTo({
            pitch: 0,
            zoom: this.zoomFactor,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.removeLayer('building-extrusion');
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
