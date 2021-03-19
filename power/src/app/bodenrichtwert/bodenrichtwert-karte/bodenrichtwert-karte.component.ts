import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { GeolocateControl, LngLatBounds, Map, MapMouseEvent, MapTouchEvent, Marker, NavigationControl, VectorSource } from 'mapbox-gl';
import BodenrichtwertKartePitchControl from '@app/bodenrichtwert/bodenrichtwert-karte/bodenrichtwert-karte-pitch-control';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { BodenrichtwertKarte3dLayerService } from '@app/bodenrichtwert/bodenrichtwert-karte/bodenrichtwert-karte-3d-layer.service';
import { environment } from '@env/environment';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';
import { FeatureCollection, Feature } from 'geojson';
import * as turf from '@turf/turf';

type Point = {
    type: 'Point';
    coordinates: number[];
};

type Polygon = {
    type: 'Polygon';
    coordinates: number[][][];
};

type MultiPolygon = {
    type: 'MultiPolygon';
    coordinates: number[][][][];
};

function polygonToPoint(p: Polygon): Point {
    const point = turf.pointOnFeature(p);

    if (point && point.geometry) {
        return {
            type: 'Point',
            coordinates: point.geometry.coordinates,
        };
    }

    return;
}

function multiPolygonToPolygons(mp: MultiPolygon): Array<Polygon> {
    return mp.coordinates.map(f => ({
        type: 'Polygon',
        coordinates: f,
    }));
}

function getLargestPolygon(mp: MultiPolygon): Polygon {
    let area = 0;
    let largest: Polygon;

    multiPolygonToPolygons(mp).forEach(p => {
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

function intersectPolygon(p: Polygon | MultiPolygon, intersect: Polygon): Array<Polygon> {
    const f = turf.intersect(intersect, p);
    if (f && f.geometry) {
        switch (f.geometry.type) {
            case 'Polygon':
                return [f.geometry];
            case 'MultiPolygon':
                return multiPolygonToPolygons(f.geometry);
        }
    }

    return [];
}

function bufferPolygon(p: Polygon | MultiPolygon, buffer: number): Array<Polygon> {
    try {
        const f = turf.buffer(p, buffer, { units: 'meters' });
        if (f && f.geometry) {
            switch (f.geometry.type) {
                case 'Polygon':
                    return [f.geometry];
                case 'MultiPolygon':
                    const arr = multiPolygonToPolygons(f.geometry);

                    if (arr.length > 2) {
                        return [arr.shift(), arr.pop()];
                    }

                    return arr;
            }
        }
    } catch (e) {
        // console.log(e);
    }

    return [];
}


/* eslint-disable max-lines */
@Component({
    selector: 'power-bodenrichtwertkarte',
    templateUrl: './bodenrichtwert-karte.component.html',
    styleUrls: ['./bodenrichtwert-karte.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertKarteComponent implements OnChanges {

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

    @Input() currentZoom: number;
    @Output() currentZoomChange = new EventEmitter<number>();

    @Input() currentPitch: number;
    @Output() currentPitchChange = new EventEmitter<number>();

    @Input() standardBaulandZoom: number;
    @Input() standardLandZoom: number;

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
                this.map.easeTo({
                    zoom: this.currentZoom,
                    center: this.latLng?.length ? [this.latLng[1], this.latLng[0]] : this.map.getCenter()
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
            // 3D-Modus temporarly deactivated (WIP)
            // if (changes.features && !changes.features.firstChange) {
            //     this.bodenrichtwert3DLayer.onFeaturesChange(changes.features,
            //         this.map, this.stichtag, this.teilmarkt);
            // }
        }
    }

    /**
     * loadMap initializes the Mapbox GL map object
     * @param event map
     */
    public loadMap(event: Map) {
        this.map = event;

        this.map.addSource('geoserver_br_br', this.bremenSource);

        this.map.addSource('geoserver_nds_br', this.ndsSource);

        this.map.addSource('geoserver_nds_fst', this.ndsFstSource);

        // add navigation control
        const navControl = new NavigationControl({
            visualizePitch: true
        });
        this.map.addControl(navControl, 'top-left');

        // add geolocation control
        const geolocateControl = new GeolocateControl();
        this.map.addControl(geolocateControl, 'top-left');

        const pitchControl = new BodenrichtwertKartePitchControl();
        this.map.addControl(pitchControl, 'top-left');

        // update the map on reload if coordinates exist
        if (this.latLng.length) {
            this.map.resize();
            this.marker.setLngLat([this.latLng[1], this.latLng[0]]).addTo(this.map);
            this.flyTo(this.latLng[0], this.latLng[1]);
        }
    }

    /**
     * onZoomEnd emits the current zoom level onZoomEnd
     */
    public onZoomEnd() {
        this.currentZoomChange.emit(this.map.getZoom());
    }

    /**
     * onPitchEnd emits the current pitch onPitchEnd
     */
    public onPitchEnd() {
        this.currentPitchChange.emit(this.map.getPitch());
    }

    /**
     * onRotate emits the current rotation level onRotate
     */
    public onRotate() {
        this.currentPitchChange.emit(this.map.getPitch());

        // 3D-Layer temporarly deactivated
        // this.bodenrichtwert3DLayer.onRotate(this.features, this.map, this.stichtag, this.teilmarkt);
    }

    /**
     * determineZoomFactor determines the zoom depending on current zoomlvl and teilmarkt
     */
    public determineZoomFactor(): number {
        // Bauland
        if (this.teilmarkt.text === 'Bauland') {
            return this.standardBaulandZoom;
            // Landwirtschaft
        } else {
            return this.standardLandZoom;
        }
    }

    /**
     * flyTo executes a flyTo for a given latLng
     */
    public flyTo(lat: number, lng: number) {
        this.map.flyTo({
            center: [lng, lat],
            zoom: this.currentZoom,
            speed: 1,
            curve: 1,
            bearing: 0,
            pitch: this.currentPitch
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
        if (!this.latLng?.length) {
            this.currentZoomChange.emit(this.determineZoomFactor());
        }
        if (event.lngLat) {
            this.latLngChange.emit([event.lngLat.lat, event.lngLat.lng]);
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
            pitch: 0,
            bearing: 0
        });
        this.resetMapFiredChange.emit(false);
    }

    // list of ids where the label shouldn't be displayed
    doNotDisplay = [
        'DENIBR4318B07171',
        'DENIBR4316B37171',
        'DENIBR4319B07171',
        'DENIBR4315B37171',
        'DENIBR4320B07171',
        'DENIBR4321B07171',
        'DENIBR4317B37171',
        'DENIBR4313B37171',
        'DENIBR4314B37171',

        'DENIBR8020B02418',
        'DENIBR8017B02418',
        'DENIBR8014B02418',
        'DENIBR8016B02418',
        'DENIBR8019B02418',
        'DENIBR8013B02418',
        'DENIBR8018B02418',
        'DENIBR8015B02418',
        'DENIBR8021B02418'
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
                };

                this.dynamicLabelling(this.landwirtschaftData, ['landwirtschaft', 'landwirtschaft_bremen'], 'landwirtschaftSource');
            };
        }
    }

    /**
     * dynamicLabelling
     * @param labelData
     * @param layerNames
     * @param sourceName
     */
    public dynamicLabelling(labelData: FeatureCollection, layerNames: string[], sourceName: string) {
        labelData.features = [];

        const featureMap: Record<string, Feature<Polygon>[]> = {};

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

        let buffer: number;
        if (this.map.getZoom() > 17) {
            buffer = -10;
        } else if (this.map.getZoom() > 16) {
            buffer = -20;
        } else if (this.map.getZoom() > 15) {
            buffer = -30;
        } else if (this.map.getZoom() > 14) {
            buffer = -40;
        } else if (this.map.getZoom() < 14) {
            buffer = -50;
        }

        this.map.queryRenderedFeatures(null, { layers: layerNames }).forEach(f => {
            if (!f || !f.geometry) {
                return;
            }

            if (this.doNotDisplay.includes(f.properties['objektidentifikator'])) {
                return;
            };

            let p: Polygon;

            switch (f.geometry.type) {
                case 'MultiPolygon':
                    p = getLargestPolygon(f.geometry);
                    break;
                case 'Polygon':
                    p = f.geometry;
                    break;
                default:
                    return;
            }

            if (p && p.coordinates) {
                if (featureMap[f.properties.objektidentifikator]) {
                    featureMap[f.properties.objektidentifikator].push({
                        type: 'Feature',
                        geometry: p,
                        properties: f.properties,
                    });
                } else {
                    featureMap[f.properties.objektidentifikator] = [{
                        type: 'Feature',
                        geometry: p,
                        properties: f.properties,
                    }];
                }
            }
        });

        const features: Array<Feature<Polygon | Point>> = [];

        // eslint-disable-next-line complexity
        Object.keys(featureMap).forEach(key => {
            let p: Polygon;

            featureMap[key].forEach(each => {
                if (p && p.coordinates) {
                    const union = turf.union(p, each);
                    switch (union.geometry.type) {
                        case 'Polygon':
                            p = union.geometry;
                            return;
                        case 'MultiPolygon':
                            p = getLargestPolygon(union.geometry);
                            return;
                    }
                }
                p = each.geometry;
            });

            intersectPolygon(p, mapViewBound).forEach(i => {
                bufferPolygon(i, buffer).forEach(b => {
                    if (this.map.getZoom() > 14) {
                        const point = polygonToPoint(b);
                        if (point && point.coordinates) {
                            features.push({
                                type: 'Feature',
                                geometry: point,
                                properties: featureMap[key][0].properties,
                            });
                            return;
                        }
                    }
                    features.push({
                        type: 'Feature',
                        geometry: b,
                        properties: featureMap[key][0].properties,
                    });
                });
            });
        });

        labelData.features = features;

        const source = this.map.getSource(sourceName);
        if (source.type === 'geojson') {
            source.setData(labelData);
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
