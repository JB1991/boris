import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { MapboxGeoJSONFeature, MapMouseEvent, Marker, Point } from 'mapbox-gl';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'power-bodenwert-kalkulator',
  templateUrl: './bodenwert-kalkulator.component.html',
  styleUrls: ['./bodenwert-kalkulator.component.scss']
})
export class BodenwertKalkulatorComponent implements OnInit {

  MAP_STYLE_URL = environment.basemap;
  marker: Marker;
  data;
  adresse;
  flurstueckSelection = new Map<string, MapboxGeoJSONFeature>();

  baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

  map;
  features: any;
  private threedActive = false;
  searchActive = false;
  @ViewChild('acc') acc: NgbAccordion;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Bodenwerte - POWER.NI');
  }

  ngOnInit() {
  }

  onMapClickEvent(e: MapMouseEvent) {
    if (e.point) {
      const features = this.map.queryRenderedFeatures(new Point(e.point.x, e.point.y), {layers: ['flurstuecke-fill']});
      for (const feature of features) {
        if (this.flurstueckSelection.has(feature.properties.gml_id)) {
          this.flurstueckSelection.delete(feature.properties.gml_id);
        } else {
          this.flurstueckSelection.set(feature.properties.gml_id, feature);
        }

        if (this.flurstueckSelection.size > 0) {
          this.acc.expand('ngb-panel-0');
        } else {
          this.acc.collapse('ngb-panel-0');
        }
      }
      this.map.setFilter('flurstuecke-highlighted', null);

      const filter = ['in', 'gml_id'];
      for (const l of Array.from(this.flurstueckSelection.values())) {
        filter.push(l.properties.gml_id);
      }
      this.map.setFilter('flurstuecke-highlighted', filter);
    }
  }

  loadMap($event: any) {
    this.map = $event;
  }

  flyTo(evt: any) {
    this.adresse = evt.properties.text;
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = new Marker({
      color: '#c4153a'
    })
      .setLngLat(evt.geometry.coordinates)
      .addTo(this.map);
    this.marker.togglePopup();
    this.map.flyTo({
      center: evt.geometry.coordinates,
      zoom: 15,
      speed: 1,
      curve: 1,
    });
  }

  toggle3DView(checked: boolean) {
    if (checked) {
      const layers = this.map.getStyle().layers;
      let firstSymbolId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
          firstSymbolId = layers[i].gml_id;
          break;
        }
      }
      this.map.addLayer({
        id: 'building-extrusion',
        type: 'fill-extrusion',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-extrusion-color': 'rgb(219, 219, 218)',
          'fill-extrusion-height': 0,
          'fill-extrusion-opacity': 1,
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
    } else if (!checked) {
      this.map.easeTo({
        pitch: 0,
        center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
      });
      this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
      this.map.removeLayer('building-extrusion');
    }
  }

  toggle3dView() {
    if (!this.threedActive) {
      const layers = this.map.getStyle().layers;
      let firstSymbolId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
          firstSymbolId = layers[i].id;
          break;
        }
      }
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
    } else if (this.threedActive) {
      this.map.easeTo({
        pitch: 0,
        zoom: 14,
        center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
      });
      this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
      this.map.removeLayer('building-extrusion');
    }
    this.threedActive = !this.threedActive;
  }

  toggleSearchActive() {
    this.searchActive = !this.searchActive;
  }
}
