import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { Layer, LngLat, LngLatBounds, MapboxGeoJSONFeature, Marker, Point } from 'mapbox-gl';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'power-bodenwert-kalkulator',
    templateUrl: './bodenwert-kalkulator.component.html',
    styleUrls: ['./bodenwert-kalkulator.component.scss']
})
export class BodenwertKalkulatorComponent implements OnInit {

    threeDActive = false;
    searchActive = false;
    filterActive = false;

    baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    MAP_STYLE_URL = environment.basemap;

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

    @ViewChild('acc') acc: NgbAccordion;

    constructor(private titleService: Title) {
        this.titleService.setTitle('Bodenwerte - POWER.NI');
    }

    ngOnInit() {
    }

    onMapClickEvent(event: any) {
        if (event.point) {
            const point: Point = new Point(event.point.x, event.point.y);
            const features: MapboxGeoJSONFeature[] =
                this.map.queryRenderedFeatures(point, {layers: ['flurstuecke-fill']});

            for (const feature of features) {
                this.updateFlurstueckSelection(feature);
            }
            this.showOrHideFlurstueckPanel();
            this.updateFlurstueckHighlighting();
        }
    }

    updateFlurstueckSelection(feature: MapboxGeoJSONFeature) {
        if (this.flurstueckSelection.has(feature.properties.gml_id)) {
            this.flurstueckSelection.delete(feature.properties.gml_id);
        } else {
            this.flurstueckSelection.set(feature.properties.gml_id, feature);
        }
    }

    showOrHideFlurstueckPanel() {
        if (this.flurstueckSelection.size > 0) {
            this.acc.expandAll();
        } else {
            this.acc.collapseAll();
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
        this.marker.togglePopup();
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
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
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
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
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
            });
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
