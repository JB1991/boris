import { Injectable } from '@angular/core';
import intersect from '@turf/intersect';
import union from '@turf/union';
import { Feature, Geometry } from 'geojson';
import polylabel from 'polylabel';
import pointInPolygon from '@turf/boolean-point-in-polygon'

@Injectable({
    providedIn: 'root'
})

export class DynamicLabellingService {
    /**
     * Generate Point Features
     * @param arr array with longitude, latitude and properties of each point feature
     * @returns array of point features
     */
    public generatePointFeatures(arr: {
        lng: number,
        lat: number,
        properties: any,
    }[]): Array<Feature<Point>> {
        const features: Array<Feature<Point>> = [];
        arr.forEach(p => {
            features.push(this.makeFeature({
                type: 'Point',
                coordinates: [p.lng, p.lat],
            }, p.properties))
        });

        return features;
    }

    /**
     * Create line image
     * @param width line width
     * @returns image
     */
    public createLineImage(width: number): ImageData {
        const bytesPerPixel = 4; // Each pixel is 4 bytes: red, green, blue, and alpha.

        const height = 3;
        width += 2;
        const data = new Uint8ClampedArray(width * height * bytesPerPixel);

        let p = 0;
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                p++;
                if (h === 0 || h === height - 1 || w === 0 || w === width - 1) {
                    data[p * bytesPerPixel] = 255;
                    data[p * bytesPerPixel + 1] = 255;
                    data[p * bytesPerPixel + 2] = 255;
                    data[p * bytesPerPixel + 3] = 255;
                    continue
                }
                data[p * bytesPerPixel] = 0;
                data[p * bytesPerPixel + 1] = 0;
                data[p * bytesPerPixel + 2] = 0;
                data[p * bytesPerPixel + 3] = 255;
            }
        }

        return { data: data, width: width, height: height };
    }

    /**
     * Returns multiPolygon
     * @param mp multiPolygon
     * @returns array of polygons
     */
    private multiPolygonToPolygons(mp: MultiPolygon): Array<Polygon> {
        return mp.coordinates.map(f => ({
            type: 'Polygon',
            coordinates: f,
        }));
    }

    /**
     * makeFeature
     * @param geom geometry
     * @param properties properties
     * @returns feature
     */
    private makeFeature<T extends Geometry>(geom: T, properties: any): Feature<T> {
        return {
            type: 'Feature',
            geometry: geom,
            properties: properties,
        }
    }


    /**
     * unionVectorTilesFeatures unions the features of the mapbox vector tiles by a given idGetter
     * @param fts rendered mapbox vector tile features
     * @param idGetter identification getter
     * @returns array of unioned vector tile features
     */
    public unionVectorTilesFeatures(
        fts: Feature[],
        idGetter: (n: Feature) => string
    ): Feature<Polygon | MultiPolygon>[] {

        const unionedFts: Map<string, Feature<Polygon | MultiPolygon>> = new Map();

        fts.forEach(ft => {
            if (!(ft.geometry.type === 'MultiPolygon' || ft.geometry.type === 'Polygon')) {
                console.error('geom', ft);
                return;
            }

            const id = idGetter(ft);
            const existingFt = unionedFts.get(id);

            if (!existingFt) {
                unionedFts.set(id, this.makeFeature(ft.geometry, ft.properties));
            } else {
                const unionGeom = union(existingFt, ft.geometry);
                if (unionGeom) {
                    existingFt.geometry = unionGeom.geometry;
                }
            }
        });
        return Array.from(unionedFts.values());
    }

    /**
     * intersectFeatureWithBBox intersects the a feature with the bbox of the current view
     * @param ft feature to intersect
     * @param bbox bounding box of the current view
     * @returns intersected polygon feature
     */
    public intersectFeatureWithBBox(ft: Feature<Polygon | MultiPolygon>, bbox: Polygon): Feature<Polygon>[] {
        const intersection = intersect(ft, bbox);
        if (!intersection) {
            switch (ft.geometry.type) {
                case 'Polygon':
                    return [this.makeFeature(ft.geometry, ft.properties)];
                case 'MultiPolygon':
                    return this.multiPolygonToPolygons(ft.geometry).map(p => this.makeFeature(p, ft.properties));
            }
        }

        if (intersection.geometry.type === 'MultiPolygon') {
            return this.multiPolygonToPolygons(intersection.geometry).map(p => this.makeFeature(p, ft.properties));
        }
        return [{
            type: 'Feature',
            geometry: intersection.geometry,
            properties: ft.properties
        }];
    }

    /**
     * pointOnFeature calculates a point for the labeling with the polylabel function
     * @param ft feature to polylabel
     * @returns point feature of polylabel
     */
    public pointOnFeature(ft: Feature<Polygon>): Feature<Point> {
        return this.makeFeature({
            type: 'Point',
            coordinates: polylabel(ft.geometry.coordinates, 0.0001, false)
        }, ft.properties);
    }

    /**
     * dynamicLabelling
     * @param input input features
     * @param bound bounding box
     * @param idGetter identification getter
     * @param doNotDisplayGetter get property
     * @param doNotDisplay ignore features with property from doNotDisplayGetter
     * @param output output features
     * @returns features
     */
    public dynamicLabelling(
        input: Feature[],
        bound: Polygon,
        idGetter: (n: Feature) => string,
        doNotDisplayGetter: (n: Feature) => string,
        doNotDisplay: string[],
        output: Array<Feature<Point>>): Array<Feature<Point>> {

        if (output) {
            output = output.filter(ft => pointInPolygon(ft.geometry.coordinates, bound));
        }

        if (doNotDisplay) {
            input = input.filter((ft) => !doNotDisplay.includes(doNotDisplayGetter(ft)));
        }

        const unionedFts = this.unionVectorTilesFeatures(input, idGetter);

        unionedFts.forEach(ft => {
            const intersection = this.intersectFeatureWithBBox(ft, bound);
            output.push(...intersection.map((i) => this.pointOnFeature(i)));
        });

        return output;
    }
}

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
