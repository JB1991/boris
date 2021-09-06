/* istanbul ignore file */
import { Injectable, SimpleChange } from '@angular/core';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
// eslint-disable-next-line
// @ts-ignore
import { FillExtrusionLayer, Map } from 'maplibre-gl';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';

export interface ExtrusionLayerOptions {
    extrusionHeight: number;
    gapHeight: number;
    maxZoom: number;
    minZoom: number;
}

@Injectable({
    providedIn: 'root'
})
export class BodenrichtwertKarte3dLayerService {

    // layer ids for label layer (Bauland, Landwirtschaft)
    public readonly layerNamesB = ['bauland', 'bauland_bremen'];

    public readonly layerNamesLF = ['landwirtschaft', 'landwirtschaft_bremen'];

    // layer ids of label layer (Bauland, Landwirtschaft)
    public readonly layerLabelB = 'bauland_labels';

    public readonly layerLabelLF = 'landwirtschaft_labels';

    // active3dLayer contains the current 3d layer state
    public active3dLayer = false;

    // minPitch minimal rotation angle/pitch
    public minPitch = 20;

    // baulandOptions contains the display options for the bauland extrustion layer
    public readonly baulandOptions: ExtrusionLayerOptions = {
        extrusionHeight: 50,
        gapHeight: 25,
        minZoom: 11,
        maxZoom: 15
    };

    // landwirtschaftOptions contains the display options for the landwirtschaft extrustion layer
    public readonly landwirtschaftOptions: ExtrusionLayerOptions = {
        extrusionHeight: 250,
        gapHeight: 100,
        minZoom: 10,
        maxZoom: 13
    };

    // extrusionLayer template for the extrusion layers
    public readonly extrusionLayer: FillExtrusionLayer = {
        'id': '',
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {}
    };

    // gapLayer tamplate for the hidden gap layers
    public readonly gapLayer: FillExtrusionLayer = {
        'id': '',
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {
            'fill-extrusion-opacity': 0
        }
    };

    constructor() {
        // This is intentional
    }

    /**
     * onFeaturesChange removes Layers depending on whether a previous feature exists or not
     * and adds Layer depending on whether the rotation angle/pitch is > minPitch
     * @param fts SimpleChange
     * @param map map object
     * @param stichtag current stichtag
     * @param teilmarkt current teilmarkt
     */
    public onFeaturesChange(fts: SimpleChange, map: Map, stichtag: string, teilmarkt: Teilmarkt): void {
        const previousFeatures = fts.previousValue;
        const currentFeatures = fts.currentValue;

        if (previousFeatures?.features.length && this.active3dLayer) {
            this.remove3dLayer(previousFeatures, map, stichtag);
        }
        if (currentFeatures?.features.length && map.getPitch() > this.minPitch) {
            this.add3dLayer(currentFeatures, map, stichtag, teilmarkt);
        }
    }

    /**
     * add3dLayer adds layers for specific feature collection and stichtag
     * @param fts features
     * @param map map
     * @param stichtag stichtag
     * @param teilmarkt teilmarkt
     */
    // tslint:disable-next-line: max-func-body-length
    public add3dLayer(fts: FeatureCollection, map: Map, stichtag: string, teilmarkt: Teilmarkt): void {
        this.active3dLayer = true;
        const filteredFts = this.filterCollectionByStag(fts, stichtag);
        const opacity = this.getOpacityByRotation(map, 0.6);

        let opt: ExtrusionLayerOptions;
        let labelLayerId: string;

        if (teilmarkt.value.includes('B')) {
            opt = this.baulandOptions;
            labelLayerId = this.layerLabelB;
        } else {
            opt = this.landwirtschaftOptions;
            labelLayerId = this.layerLabelLF;
        }

        filteredFts.forEach((ft, i) => {
            const id = ft.properties?.['objectid'];
            const layerId = id.toString();

            const height = opt.extrusionHeight * (i + 1);

            let prevHeight: number;
            if (i === 0) {
                prevHeight = 0;
            } else {
                prevHeight = opt.extrusionHeight * i;
            }

            // set options for extrusion layer
            this.extrusionLayer.id = layerId;
            this.extrusionLayer.maxzoom = opt.maxZoom;
            this.extrusionLayer.minzoom = opt.minZoom;
            if (this.extrusionLayer.paint) {
                this.extrusionLayer.paint['fill-extrusion-color'] = teilmarkt.hexColor;
                this.extrusionLayer.paint['fill-extrusion-opacity'] = opacity;
                this.extrusionLayer.paint['fill-extrusion-height'] = height;
                this.extrusionLayer.paint['fill-extrusion-base'] = prevHeight + opt.gapHeight;
                this.extrusionLayer.filter = ['==', 'objectid', id];
            }

            // set options for hidden gap layer
            this.gapLayer.id = layerId + 'hidden';
            this.extrusionLayer.maxzoom = opt.maxZoom;
            this.extrusionLayer.minzoom = opt.minZoom;
            if (this.gapLayer.paint) {
                this.gapLayer.paint['fill-extrusion-height'] = opt.gapHeight;
                this.gapLayer.paint['fill-extrusion-base'] = prevHeight;
            }
            this.gapLayer.filter = ['==', 'objectid', id];

            // add layers
            map.addLayer(this.extrusionLayer);
            map.addLayer(this.gapLayer);
            // move layer beneathe the label layer
            map.moveLayer(this.extrusionLayer.id, labelLayerId);
            map.moveLayer(this.gapLayer.id, labelLayerId);

        });
    }

    /**
     * remove3dLayer removes layers for a specific feature collection and stichtag
     * @param fts features
     * @param map map
     * @param stichtag stichtag
     */
    public remove3dLayer(fts: FeatureCollection, map: Map, stichtag: string): void {
        this.active3dLayer = false;
        const filteredFts = this.filterCollectionByStag(fts, stichtag);

        filteredFts.forEach((ft) => {
            const id = ft.properties?.['objectid'];
            const layerId = id.toString();
            map.removeLayer(layerId);
            map.removeLayer(layerId + 'hidden');
        });
    }

    /**
     * filterCollectionByStag filters the feature collection by a given stichtag (stag)
     * @param fts FeatureCollection
     * @param stichtag stichtag
     * @returns returns the filtered features
     */
    public filterCollectionByStag(fts: FeatureCollection, stichtag: string):
        Array<Feature<Geometry, GeoJsonProperties>> {
        const filteredFts = fts.features.filter((ft) =>
            ft.properties?.['stag'].substr(0, 10) === stichtag
        );
        return filteredFts;
    }

    /**
     * onRotate updates the opacity of 3d layers depending on the rotation angle/pitch
     * @param fts FeatureCollection
     * @param map map
     * @param stichtag stichtag
     * @param teilmarkt teimarkt
     */
    public onRotate(fts: FeatureCollection, map: Map, stichtag: string, teilmarkt: Teilmarkt): void {
        const filteredFts = this.filterCollectionByStag(fts, stichtag);

        const opacityLayer = this.getOpacityByRotation(map, 0.6);

        // update opacity for filtered features if layer exists
        // otherwise create layer first
        if (this.active3dLayer) {
            filteredFts.forEach((ft) => {
                map.setPaintProperty(ft.properties?.['objectid'], 'fill-extrusion-opacity', opacityLayer);
            });
        } else if (fts.features.length) {
            this.active3dLayer = true;
            this.add3dLayer(fts, map, stichtag, teilmarkt);
        }
    }

    /**
     * getOpacityByRotation returns a number between 0 and 0.6 as opacity.
     * The opacity is calculated depending on the current rotation angle/pitch of the map
     * @param map map object
     * @param maxOpacity number
     * @returns returns the opacity
     */
    public getOpacityByRotation(map: Map, maxOpacity: number): number {
        let opacity: number;
        if (map.getPitch() > this.minPitch) {
            opacity = maxOpacity / 60 * map.getPitch();
        } else {
            opacity = 0;
        }
        return opacity;
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
