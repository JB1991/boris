import { Injectable } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { FillExtrusionLayer, Map, SymbolLayer } from 'mapbox-gl';

export interface ExtrusionLayerOptions {
    extrusionHeight: number
    gapHeight: number
    maxZoom: number
    minZoom: number
}

@Injectable({
    providedIn: 'root'
})
export class BodenrichtwertKarte3dLayerService {

    // layerNames bauland
    public layerNamesB = ['bauland', 'bauland_bremen'];

    // layerNames landwirtschaft
    public layerNamesLF = ['landwirtschaft', 'landwirtschaft_bremen'];

    // active3dLayer contains the current 3d layer state
    public active3dLayer: boolean;

    // minPitch minimal rotation angle/pitch
    public minPitch = 20;

    // baulandOptions contains the display options for the bauland extrustion layer
    public baulandOptions: ExtrusionLayerOptions = {
        extrusionHeight: 50,
        gapHeight: 25,
        minZoom: 11,
        maxZoom: 15
    }

    // landwirtschaftOptions contains the display options for the landwirtschaft extrustion layer
    public landwirtschaftOptions: ExtrusionLayerOptions = {
        extrusionHeight: 250,
        gapHeight: 100,
        minZoom: 10,
        maxZoom: 13
    }

    // extrusionLayer template for the extrusion layers
    public extrusionLayer: FillExtrusionLayer = {
        'id': '',
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {}
    };

    // gapLayer tamplate for the hidden gap layers
    public gapLayer: FillExtrusionLayer = {
        'id': '',
        'type': 'fill-extrusion',
        'source': 'geoserver_nds_br',
        'source-layer': 'br_brzone_flat_with_display',
        'paint': {
            'fill-extrusion-opacity': 0
        }
    };

    // unique 3d label layer id
    public labelId: string = '3d-label-layer';

    // labelLayer template to put the label on of the 3d layers
    public labelLayer: SymbolLayer = {
        'id': this.labelId,
        'type': 'symbol',
        'source': '',
        'paint': {
            'text-halo-color': '#fff',
            'text-halo-width': 2,
            'text-halo-blur': 2
        },
        'layout': {
            'visibility': 'visible',
            'text-max-width': 0
        }
    };
    constructor() { }

    /**
     * onFeaturesChange removes Layers depending on whether a previous feature exists or not
     * and adds Layer depending on whether the rotation angle/pitch is > minPitch
     */
    public onFeaturesChange(fts: SimpleChange, map: Map, stichtag: string, teilmarkt: any) {
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
     */
    // tslint:disable-next-line: max-func-body-length
    public add3dLayer(fts: FeatureCollection, map: Map, stichtag: string, teilmarkt: any) {
        this.active3dLayer = true;
        const filteredFts = this.filterCollectionByStag(fts, stichtag);
        const opacity = this.getOpacityByRotation(map, 0.6);

        let opt: ExtrusionLayerOptions;
        if (teilmarkt.value.includes('B')) {
            opt = this.baulandOptions;
        } else {
            opt = this.landwirtschaftOptions;
        }

        let ftId: string;

        filteredFts.forEach((ft, i) => {
            const id = ft.properties.objectid;
            const layerId = id.toString();
            ftId = ft.properties.objektidentifikator.toString();

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
            this.extrusionLayer.paint['fill-extrusion-color'] = teilmarkt.color;
            this.extrusionLayer.paint['fill-extrusion-opacity'] = opacity;
            this.extrusionLayer.paint['fill-extrusion-height'] = height;
            this.extrusionLayer.paint['fill-extrusion-base'] = prevHeight + opt.gapHeight;
            this.extrusionLayer.filter = ['==', 'objectid', id];

            // set options for hidden gap layer
            this.gapLayer.id = layerId + 'hidden';
            this.extrusionLayer.maxzoom = opt.maxZoom;
            this.extrusionLayer.minzoom = opt.minZoom;
            this.gapLayer.paint['fill-extrusion-height'] = opt.gapHeight;
            this.gapLayer.paint['fill-extrusion-base'] = prevHeight;
            this.gapLayer.filter = ['==', 'objectid', id];

            map.addLayer(this.extrusionLayer);
            map.addLayer(this.gapLayer);
        });
        // set new label on top
        this.add3dLabel(ftId, map, stichtag, teilmarkt);
    }

    /**
     * add3dLabel adds a label for the currently active 3d layer
     * @param id id of the 3d feature
     * @param map map
     * @param stichtag stichtag 
     * @param teilmarkt teilmarkt
     */
    public add3dLabel(id: string, map: Map, stichtag: string, teilmarkt: any) {
        let layerNames: string[];
        let sourceName: string;

        // handle different teilmärkte
        if (teilmarkt.value.includes('B')) {
            layerNames = this.layerNamesB;
            sourceName = 'baulandSource';
        } else {
            layerNames = this.layerNamesLF;
            sourceName = 'landwirtschaftSource';
        }

        // query features with display value
        const ftsDisplay = map.queryRenderedFeatures(null, { layers: layerNames }).filter(f =>
            f.properties.objektidentifikator === id
        );

        // random ft props (all have the same display value!)
        const props = ftsDisplay[0].properties;

        this.labelLayer.source = sourceName;
        this.labelLayer.paint['text-color'] = teilmarkt.color;
        this.labelLayer.layout['text-field'] = props.display;
        this.labelLayer.layout['text-allow-overlap'] = true;
        this.labelLayer.filter = ['==', 'objektidentifikator', props.objektidentifikator];

        map.addLayer(this.labelLayer);
    }

    /**
     * remove3dLayer removes layers for a specific feature collection and stichtag
     * @param fts features
     * @param map map
     * @param stichtag stichtag 
     */
    public remove3dLayer(fts: FeatureCollection, map: Map, stichtag: string) {
        this.active3dLayer = false;
        const filteredFts = this.filterCollectionByStag(fts, stichtag);

        filteredFts.forEach((ft) => {
            const id = ft.properties.objectid;
            const layerId = id.toString();
            map.removeLayer(layerId);
            map.removeLayer(layerId + 'hidden');
        });
        map.removeLayer(this.labelId);
    }

    /**
     * filterCollectionByStag filters the feature collection by a given stichtag (stag)
     * @param features features
     * @param stichtag stichtag
     */
    public filterCollectionByStag(fts: FeatureCollection, stichtag: string) {
        if (fts) {
            const filteredFts = fts.features.filter(ft =>
                ft.properties.stag.substr(0, 10) === stichtag
            );
            // console.log(filteredFts);
            return filteredFts;
        }
    }

    /**
     * onRotate updates the opacity of 3d layers depending on the rotation angle/pitch
     * @param collection 
     * @param map 
     * @param stichtag 
     */
    public onRotate(fts: FeatureCollection, map: Map, stichtag: string, teilmarkt: any) {
        const filteredFts = this.filterCollectionByStag(fts, stichtag);

        const opacityLayer = this.getOpacityByRotation(map, 0.6);
        const opacityLabel = this.getOpacityByRotation(map, 1.0);

        // update opacity for filtered features if layer exists
        // otherwise create layer first
        if (this.active3dLayer) {
            filteredFts.forEach(ft => {
                map.setPaintProperty(ft.properties.objectid, 'fill-extrusion-opacity', opacityLayer);
            });
            // set opacity for label layer
            map.setPaintProperty(this.labelId, 'text-opacity', opacityLabel);
        } else if (fts.features.length) {
            this.active3dLayer = true;
            this.add3dLayer(fts, map, stichtag, teilmarkt);
        }
    }

    /**
     * getOpacityByRotation returns a number between 0 and 0.6 as opacity.
     * The opacity is calculated depending on the current rotation angle/pitch of the map
     * @param map map object
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
