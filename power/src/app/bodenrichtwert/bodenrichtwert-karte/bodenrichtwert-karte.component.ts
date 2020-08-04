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

  baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  MAP_STYLE_URL = environment.basemap;

  map: Map;
  marker: Marker = new Marker({
    color: '#c4153a',
  });

  zoom = 18;

  lat: number;
  lng: number;

  x;
  y;

  @Input() teilmarkt;
  @Output() teilmarktChange = new EventEmitter();

  TEILMAERKTE = TEILMAERKTE;

  @Input() stichtag;
  @Output() stichtagChange = new EventEmitter();

  STICHTAGE = STICHTAGE;

  f;

  bounds = new LngLatBounds([
    [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
  ]);

  constructor(
    private bodenrichtwertService: BodenrichtwertService,
    private geosearchService: GeosearchService
  ) {
  }

  ngOnInit() {
  }

  loadMap(event: Map) {
    this.map = event;
    if (this.zoom && this.x && this.y) {
      this.map.setZoom(this.zoom);
      this.map.setCenter([this.x, this.y]);
    }
  }

  public toggleSearchActive() {
    this.searchActive = !this.searchActive;
  }

  public toggleFilterActive() {
    this.filterActive = !this.filterActive;
  }

  flyTo(evt: any) {
    this.marker.setLngLat(evt.geometry.coordinates).addTo(this.map);
    this.map.flyTo({
      center: evt.geometry.coordinates,
      zoom: 14,
      speed: 1,
      curve: 1,
      bearing: 0
    });
    this.getBodenrichtwertzonen(
      evt.geometry.coordinates[1],
      evt.geometry.coordinates[0],
      this.teilmarkt.value);
  }

  getBodenrichtwertzonen(lat: number, lng: number, entw: string) {
    this.bodenrichtwertService.getFeatureByLatLonEntw(lat, lng, this.teilmarkt.value).subscribe(res => {
      console.log(res);
      this.bodenrichtwertService.updateFeatures(res);
    });
  }

  getAddressFromLatLng(lat, lng) {
    this.geosearchService.getAdressFromCoordinates(lat, lng)
      .subscribe(res => this.geosearchService.updateFeatures(res.features[0]));
  }

  onMapClickEvent(evt: mapboxgl.MapMouseEvent) {
    if (evt.lngLat) {
      this.lat = evt.lngLat.lat;
      this.lng = evt.lngLat.lng;

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

  onSearchSelect(evt: any) {
    this.marker.setLngLat(evt.geometry.coordinates).addTo(this.map);
    this.map.flyTo({
      center: evt.geometry.coordinates,
      zoom: 14,
      speed: 1,
      curve: 1,
      bearing: 0
    });
    this.getBodenrichtwertzonen(evt.geometry.coordinates[1], evt.geometry.coordinates[0], 'B');
  }

  toggle3dView() {
    if (!this.threeDActive) {
      this.activate3D();
    } else if (this.threeDActive) {
      this.deactivate3D();
    }
    this.threeDActive = !this.threeDActive;
  }

  private activate3D() {
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

  private deactivate3D() {
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

  onTeilmarktChange(teilmarkt: Selection) {
    this.teilmarkt = teilmarkt;
    this.getBodenrichtwertzonen(this.lat, this.lng, this.teilmarkt.value);
  }

  resetMap() {
    this.map.resize();
    this.deactivate3D();
    this.map.fitBounds([
      [6.19523325024787, 51.2028429493903],
      [11.7470832174838, 54.1183357191213]
    ], {
      pitch: 0,
      bearing: 0
    });
  }

  onResize(event) {
    console.log(event);
    this.map.resize();
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
