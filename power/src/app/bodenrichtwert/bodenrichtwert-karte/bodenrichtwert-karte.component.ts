import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { LngLat, LngLatBounds, Map, Marker, VectorSource } from 'mapbox-gl';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { AlkisWfsService } from '@app/shared/flurstueck-search/alkis-wfs.service';
import { BodenrichtwertKarte3dLayerService } from '@app/bodenrichtwert/bodenrichtwert-karte/bodenrichtwert-karte-3d-layer.service';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import * as epsg from 'epsg';
import proj4 from 'proj4';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';


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
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertKarteComponent implements OnInit, OnChanges {

    public searchActive = false;
    public filterActive = false;
    public threeDActive = false;
    public functionsActive = false;

    public isDragged = false;
    public zoomFactor: number;

    public baulandColorPalette = ['#794c74', '#c56183', '#fadcaa', '#b2deec'];

    public baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    // Bremen - Tile Source
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

    public brBounds = [8.483772095325497, 53.01056958991861, 8.990848892958946, 53.61043564706235];

    public bremenSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.brTiles],
        bounds: this.brBounds,
    };

    // NDS - Tile Sources
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

    // Labels

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

    public lat: number;
    public lng: number;

    @Input() teilmarkt: any;
    @Output() teilmarktChange = new EventEmitter();

    @Input() stichtag;
    @Output() stichtagChange = new EventEmitter();

    @Input() isCollapsed;
    @Output() isCollapsedChange = new EventEmitter();

    @Input() expanded;

    @Input() collapsed;

    @Input() adresse;
    @Output() adresseChange = new EventEmitter();

    @Input() features;
    @Output() featuresChange = new EventEmitter();

    @Input() flurstueck: FeatureCollection;

    private fskIsChanged: boolean;

    public previousFeatures: FeatureCollection;

    public resetMapFired = false;

    constructor(
        public bodenrichtwertService: BodenrichtwertService,
        public bodenrichtwert3DLayer: BodenrichtwertKarte3dLayerService,
        public geosearchService: GeosearchService,
        public alkisWfsService: AlkisWfsService,
        private route: ActivatedRoute,
        private location: Location,
        private cdr: ChangeDetectorRef,
        public alerts: AlertsService,
        private datePipe: DatePipe,
    ) { }

    /* eslint-disable-next-line complexity */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.isCollapsed && this.map) {
            this.map.resize();
            if (!this.resetMapFired) {
                this.flyTo(this.marker.getLngLat().lat, this.marker.getLngLat().lng);
            } else {
                this.map.fitBounds(this.bounds, {
                    pitch: 0,
                    bearing: 0
                });
                this.resetMapFired = !this.resetMapFired;
            }
        }
        if ((changes.adresse && changes.adresse?.currentValue ||
            changes.features && changes.features?.currentValue) && this.map) {
            if (!this.fskIsChanged) {
                this.getFlurstueckFromLatLng(this.lat, this.lng);
            } else {
                this.fskIsChanged = !this.fskIsChanged;
            }
        }
        if (changes.features && !changes.features.firstChange) {
            this.bodenrichtwert3DLayer.onFeaturesChange(changes.features, this.map, this.stichtag, this.teilmarkt);
        }
        if (changes.stichtag) {
            if (changes.stichtag.currentValue === '2020-12-31' && this.adresse?.properties.kreis === 'Stadt Bremen') {
                this.alerts.NewAlert(
                    'info',
                    $localize`Diese Daten sind noch nicht verfügbar!`,
                    $localize`Die Daten für Bremen des Jahres 2021 sind noch im Zulauf, sobald sich dies ändert können die Daten hier dargestellt werden.`
                );
            }
        }
    }

    ngOnInit() {
    }

    /**
     * Update Address, BRZ, Marker, Map, URL onFlurstueckChange
     */
    public onFlurstueckChange() {
        this.fskIsChanged = true;
        const wgs84_coords = this.pointOnFlurstueck();
        this.lat = wgs84_coords[1];
        this.lng = wgs84_coords[0];
        this.marker.setLngLat([wgs84_coords[0], wgs84_coords[1]]).addTo(this.map);
        this.getAddressFromLatLng(wgs84_coords[1], wgs84_coords[0]);
        this.getBodenrichtwertzonen(wgs84_coords[1], wgs84_coords[0], this.teilmarkt.value);
        this.flyTo(wgs84_coords[1], wgs84_coords[0]);
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

    public baulandData: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    public landwirtschaftData: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    loadMap(event: Map) {
        this.map = event;

        this.map.addSource('geoserver_br_br', this.bremenSource);

        this.map.addSource('geoserver_nds_br', this.ndsSource);

        this.map.addSource('geoserver_nds_fst', this.ndsFstSource);

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
                const tmp = this.bodenrichtwertService.TEILMAERKTE.filter(p => p.viewValue === params['teilmarkt'])[0];
                if (tmp) {
                    this.onTeilmarktChange(tmp);
                }
                if (params['lat'] && params['lng']) {
                    this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
                }
            }

            // stichtag
            if (params['stichtag']) {
                if (this.bodenrichtwertService.STICHTAGE.includes(params['stichtag'])) {
                    this.onStichtagChange(params['stichtag']);
                }
            }
            this.cdr.detectChanges();

        });
    }

    flyTo(lat: number, lng: number, eventType?: any) {
        if (this.map.getZoom() > 11.25 && !eventType) {
            this.zoomFactor = this.map.getZoom();
        } else {
            this.zoomFactor = 15.1;
        }
        this.map.flyTo({
            center: [lng, lat],
            zoom: this.zoomFactor,
            speed: 1,
            curve: 1,
            bearing: 0
        });
    }

    getBodenrichtwertzonen(lat: number, lng: number, entw: Array<string>) {
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

    getAddressFromLatLng(lat: number, lng: number) {
        this.geosearchService.getAddressFromCoordinates(lat, lng)
            .subscribe(
                res => this.geosearchService.updateFeatures(res.features[0]),
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    };

    getFlurstueckFromLatLng(lat: number, lng: number) {
        this.alkisWfsService.getFlurstueckfromCoordinates(lng, lat).subscribe(
            res => this.alkisWfsService.updateFeatures(res),
            err => {
                console.log(err);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
            }
        );
    };

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

    public onRotate() {
        this.bodenrichtwert3DLayer.onRotate(this.features, this.map, this.stichtag, this.teilmarkt);
    }

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

    onMoveEnd() {
        if (!this.map) {
            return;
        }

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

    dynamicLabelling(labelData: FeatureCollection, layerNames: string[], sourceName: string) {
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

    private deactivate3dView() {
        this.map.easeTo({
            pitch: 0,
            zoom: this.zoomFactor,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
        this.map.removeLayer('building-extrusion');
    }

    /**
     * onStichtagChange changes the stichtag to another stichtag and
     * updates the brw/url
     * @param stichtag stichtag to be switched to
     */
    onStichtagChange(stichtag: any) {
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

        this.repaintMap();

        this.changeURL();
    }

    /**
     * onTeilmarktChange changes the teilmarkt to another teilmarkt and
     * updates the brw/url
     * @param teilmarkt teilmarkt to be switched to
     */
    public onTeilmarktChange(teilmarkt: any) {
        this.teilmarkt = teilmarkt;

        const teilmarktIsEqual = this.location.path().includes('teilmarkt=' + this.teilmarkt.viewValue.split(' ', 1));
        // push info alert
        if (!teilmarktIsEqual) {
            this.alerts.NewAlert(
                'info',
                $localize`Teilmarkt gewechselt`,
                $localize`Der Teilmarkt wurde zu ` + teilmarkt.viewValue + $localize` gewechselt.`);
        }

        // ease to zoom lvl
        if (teilmarkt.viewValue === 'Bauland' && this.marker.getLngLat()) {
            this.map.easeTo({
                zoom: 14,
                center: this.marker.getLngLat()
            });
        } else if (this.marker.getLngLat()) {
            this.map.easeTo({
                zoom: 11,
                center: this.marker.getLngLat()
            });
        }
        this.teilmarktChange.emit(this.teilmarkt);
        if (this.lat && this.lng) {
            this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
        }

        this.changeURL();
    }

    public repaintMap() {
        if (this.map) {
            this.map.flyTo({
                center: this.map.getCenter(),
                zoom: this.map.getZoom(),
                speed: 1,
                curve: 1,
                bearing: 0
            });
        }
    }

    /**
     * resetMap resets all configurations set/made by the user
     */
    public resetMap() {
        this.resetMapFired = true;
        // reset URL
        this.location.replaceState('/bodenrichtwerte');

        // reset coordinates
        this.lat = undefined;
        this.lng = undefined;

        if (this.threeDActive) {
            this.deactivate3dView();
            this.threeDActive = !this.threeDActive;
        }
        if (this.marker) {
            this.marker.setLngLat([null, null]);
            this.marker.remove();
        }
        if (this.adresse) {
            this.adresseChange.emit(undefined);
        }
        if (this.features) {
            this.featuresChange.emit(undefined);
        }
        if (!this.isCollapsed) {
            this.isCollapsedChange.emit(true);
        } else {
            this.map.fitBounds(this.bounds, {
                pitch: 0,
                bearing: 0
            });
            this.map.resize();
            this.resetMapFired = !this.resetMapFired;
        }
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

/* vim: set expandtab ts=4 sw=4 sts=4: */
