import { Injectable } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { FillExtrusionLayer } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class BodenrichtwertKarte3dLayerService {

  constructor() { }

  public onFeaturesChange(fts: SimpleChange, map, stichtag: Date) {
    const previousFeatures = fts.previousValue?.features;
    if (previousFeatures) {
      this.deactivate3dLayer(previousFeatures, map, stichtag);
    }
    this.activate3dLayer(fts, map, stichtag);
  }

  public activate3dLayer(chgFeatures: SimpleChange, map, stichtag: any) {
    const features = chgFeatures.currentValue.features;
    const fts = this.filterCollectionByStag(features, stichtag);
    // // if (this.map.getPitch() > 15) {
    this.add3dLayer(fts, map);
    // }
  }

  public deactivate3dLayer(features: any, map, stichtag: any) {
    const fts = this.filterCollectionByStag(features, stichtag);
    this.removeLayers(fts, map);
  }

  public filterCollectionByStag(features, stichtag: string) {
    if (features) {
      const filteredFeatures = features.filter(ft =>
        ft.properties.stag.substr(0, 10) === stichtag
      );
      return filteredFeatures;
    }
  }

  public onRotate(collection: FeatureCollection, map, stichtag) {
    const fts = this.filterCollectionByStag(collection.features, stichtag);

    let opacity: number;
    if (map.getPitch() > 20) {
      opacity = 0.6 / 60 * map.getPitch();
    } else {
      opacity = 0;
    }
    this.changeOpacity(fts, map, opacity);
  }

  public changeOpacity(fts: any, map, opacity: number) {
    fts.forEach(ft => {
      map.setPaintProperty(ft.properties.objectid, 'fill-extrusion-opacity', opacity);
    });
  }

  // tslint:disable-next-line: max-func-body-length
  public add3dLayer(features: any, map) {
    features.forEach((ft, i) => {
      const id = ft.properties.objectid;
      const extrusionHeight = 50 + 50 * i;
      let prevExtrusionHeight: number;
      if (i === 0) {
        prevExtrusionHeight = 0;
      } else {
        prevExtrusionHeight = 50 * i;
      }
      const layerId = id.toString();

      let opacity: number;
      if (map.getPitch() > 15) {
        opacity = 0.7 / 60 * map.getPitch();
      } else {
        opacity = 0;
      }
      const layer: FillExtrusionLayer = {
        'id': layerId,
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {
          'fill-extrusion-color': '#c4153a',
          'fill-extrusion-height': extrusionHeight,
          'fill-extrusion-base': prevExtrusionHeight + 25,
          'fill-extrusion-opacity': opacity,
          'fill-extrusion-vertical-gradient': true
        },
        'filter': ['==', 'objectid', id]
      };
      const layerFill: FillExtrusionLayer = {
        'id': layerId + 'fill',
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {
          'fill-extrusion-color': '#c4153a',
          'fill-extrusion-height': 25,
          'fill-extrusion-base': prevExtrusionHeight,
          'fill-extrusion-opacity': 0,
          'fill-extrusion-vertical-gradient': true
        },
        'filter': ['==', 'objectid', id]
      };
      map.addLayer(layer);
      map.addLayer(layerFill);
    });

  }

  public removeLayers(features: any, map) {
    features.forEach((ft) => {
      const id = ft.properties.objectid;
      const layerId = id;
      map.removeLayer(layerId);
      map.removeLayer(layerId + 'fill');
    });
  }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
