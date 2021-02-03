import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { environment } from '@env/environment';
import { Layer, LngLat, LngLatBounds, MapboxGeoJSONFeature, Marker, Point, VectorSource } from 'mapbox-gl';

@Component({
    selector: 'power-bodenwert-kalkulator',
    templateUrl: './bodenwert-kalkulator.component.html',
    styleUrls: ['./bodenwert-kalkulator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenwertKalkulatorComponent implements OnInit {

    threeDActive = false;
    searchActive = false;
    filterActive = false;
    locationTrackingActive = false;
    isCollapsed = true;

    baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    MAP_STYLE_URL = environment.basemap;

    // NDS - Flustuecks Tile Source
    public ndsFstTiles = '/geoserver/gwc/service/wmts?'
        + 'REQUEST=GetTile'
        + '&SERVICE=WMTS'
        + '&VERSION=1.0.0'
        + '&LAYER=alkis:ax_flurstueck'
        + '&STYLE=&TILEMATRIX=EPSG:900913:{z}'
        + '&TILEMATRIXSET=EPSG:900913'
        + '&FORMAT=application/vnd.mapbox-vector-tile'
        + '&TILECOL={x}'
        + '&TILEROW={y}';

    public ndsBounds = [6.19523325024787, 51.2028429493903, 11.7470832174838, 54.1183357191213];

    public ndsFstSource: VectorSource = {
        type: 'vector',
        tiles: [this.baseUrl + this.ndsFstTiles],
        bounds: this.ndsBounds,
    };

    map;
    bounds = new LngLatBounds([
        [9.602684462835214, 52.376003466999975], [9.579526408716788, 52.36982114326486]
    ]);
    marker: Marker = new Marker({
        color: '#c4153a',
    });

    data;
    adresse;
    flurstueckSelection = new Map<string, MapboxGeoJSONFeature>();

    features: any;

    constructor(private titleService: Title,
        public alerts: AlertsService) {
        this.titleService.setTitle($localize`Bodenwerte - IMMOBILIENMARKT.NI`);
    }

    ngOnInit() {
    }

    public onExpanded() {
        this.map.resize();
    }

    public onCollapsed() {
        if (this.map) {
            this.map.resize();
        }
    }

    onMapClickEvent(event: any) {
        // Click event fires twice (naming conflict)
        if (event.lngLat) {
            const zoomlvl = this.map.getZoom();
            if (event.point && zoomlvl >= 14) {
                this.isCollapsed = false;
                this.map.flyTo({
                    center: event.lngLat
                });
                const point: Point = new Point(event.point.x, event.point.y);
                const features: MapboxGeoJSONFeature[] =
                    this.map.queryRenderedFeatures(point, { layers: ['flurstuecke-fill'] });
                for (const feature of features) {
                    this.updateFlurstueckSelection(feature);
                }
                this.updateFlurstueckHighlighting();
            } else if (zoomlvl <= 14) {
                this.alerts.NewAlert('warning',
                    $localize`Auswahl fehlgeschlagen`,
                    $localize`Zur Selektion von Flurstücken bitte weiter heranzoomen.`
                );
            }
        }
    }

    // selectingFlurstueck() {
    //     if (this.marker.getLngLat) {
    //         if (this.marker !== null) {
    //             this.isCollapsed = false;
    //             this.map.flyTo({
    //                 center: this.marker.getLngLat()
    //             });
    //                 let x = this.marker.getElement().getBoundingClientRect().x;
    //                 let y = this.marker.getElement().getBoundingClientRect().y;
    //                 const point: Point = new Point(x, y);
    //                 const features: MapboxGeoJSONFeature[] =
    //                     this.map.queryRenderedFeatures(point, { layers: ['flurstuecke-fill'] });
    //             for (const feature of features) {
    //                 this.updateFlurstueckSelection(feature);
    //             }
    //             console.log(this.marker);
    //             console.log(x,y);
    //             this.updateFlurstueckHighlighting();
    //         } else if (this.marker) {
    //             this.alerts.NewAlert('warning',
    //                 $localize`Auswahl fehlgeschlagen`,
    //                 $localize`Zur Selektion von Flurstücken bitte eine Adresse eingeben und bestätigen.`
    //             );
    //         }
    //     }
    // }

    updateFlurstueckSelection(feature: MapboxGeoJSONFeature) {
        if (this.flurstueckSelection.has(feature.properties.gml_id)) {
            this.flurstueckSelection.delete(feature.properties.gml_id);
            if (this.flurstueckSelection.size === 0) {
                this.isCollapsed = true;
            }
        } else {
            this.flurstueckSelection.set(feature.properties.gml_id, feature);
        }
    }

    updateFlurstueckHighlighting() {
        this.map.setFilter('flurstuecke-highlighted', null);

        const filter: string[] = ['in', 'gml_id'];
        for (const flurstueck of Array.from(this.flurstueckSelection.values())) {
            filter.push(flurstueck.properties.gml_id);
        }
        this.map.setFilter('flurstuecke-highlighted', filter);
    }

    loadMap($event: any) {
        this.map = $event;
        this.map.addSource('geoserver_fst_nds', this.ndsFstSource);
    }

    flyTo(event: any) {
        this.adresse = event.properties.text;
        if (this.marker) {
            this.marker.remove();
        }
        this.marker = new Marker({
            color: '#c4153a'
        })
            .setLngLat(event.geometry.coordinates)
            .addTo(this.map);
        this.map.flyTo({
            center: event.geometry.coordinates,
            zoom: 17,
            speed: 1,
            curve: 1,
            bearing: 0
        });
    }

    toggle3dView() {
        if (!this.threeDActive) {
            this.activate3dView();
        } else {
            this.deactivate3dView();
        }
        this.threeDActive = !this.threeDActive;
    }

    activate3dView() {
        const layers: Layer[] = this.map.getStyle().layers;
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }
        this.add3dLayer();
        this.map.easeTo({
            pitch: 60,
            zoom: 17,
            center: this.locationTrackingActive ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 15);
    }

    add3dLayer() {
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
    }

    deactivate3dView() {
        this.map.easeTo({
            pitch: 0,
            zoom: 14,
            center: this.locationTrackingActive ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
        this.map.removeLayer('building-extrusion');
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }

    toggleFilterActive() {
        this.filterActive = !this.filterActive;
    }

    public resetSelection() {
        this.flurstueckSelection.clear();
        this.updateFlurstueckHighlighting();
        this.isCollapsed = true;
    }

    resetMap() {
        this.map.resize();

        if (this.threeDActive) {
            this.deactivate3dView();
        }

        this.map.fitBounds(this.bounds, {
            pitch: 0,
            bearing: 0
        });
    }

    public toggleLocationTracking() {
        if (!this.locationTrackingActive) {
            this.enableLocationTracking();
        } else {
            this.removeLocation();
        }
        this.locationTrackingActive = !this.locationTrackingActive;
    }

    public enableLocationTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(location => {
                const lngLat = new LngLat(location.coords.longitude, location.coords.latitude);
                this.map.easeTo({
                    pitch: 0,
                    zoom: 14,
                    center: lngLat
                });
                this.marker.setLngLat(lngLat).addTo(this.map);
            });
        }
    }

    public removeLocation() {
        this.marker.remove();
    }

    public showDataNotice() {
        this.alerts.NewAlert('info', $localize`Hinweis zu Testdaten`, $localize`Hierbei handelt es sich um Testdaten.`);
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
