import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import area from '@turf/area';
import intersect from '@turf/intersect';
import union from '@turf/union';
import { Feature } from 'geojson';
import { MapboxGeoJSONFeature } from 'maplibre-gl';
import polylabel from 'polylabel';
import pointInPolygon from '@turf/boolean-point-in-polygon'

@Injectable({
    providedIn: 'root'
})

export class DynamicLabellingService {
    constructor() { }

    public generatePointFeatures(arr: {
        lng: number,
        lat: number,
        properties: any,
    }[]): Array<Feature<Point>> {
        const features: Array<Feature<Point>> = [];
        arr.forEach(p => {
            features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [p.lng, p.lat],
                },
                properties: p.properties,
            })
        });

        return features;
    }

    public createLineImage = (width) => {
        const bytesPerPixel = 4; // Each pixel is 4 bytes: red, green, blue, and alpha.

        const height = 3;
        width += 2;
        const data = new Uint8Array(width * height * bytesPerPixel);

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
     *
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
     *
     * @param mp multiPolygon
     * @returns largest polygon
     */
    private getLargestPolygon(mp: MultiPolygon): Polygon {
        let areaX = 0;
        let largest: Polygon;

        this.multiPolygonToPolygons(mp).forEach(p => {
            try {
                const a = area(p);
                if (!largest || a > areaX) {
                    if (a > areaX) {
                        areaX = a;
                        largest = {
                            type: 'Polygon',
                            coordinates: p.coordinates,
                        };
                    }
                }
            } catch (e) {
                if (!environment.production) {
                    console.error(e);
                }
            }
        });
        return largest;
    }

    /**
     *
     * @param p polygon or multiPolygon
     * @param intersec polygon
     * @returns array of polygons
     */
    private intersectPolygon(p: Polygon | MultiPolygon, intersec: Polygon): Polygon | MultiPolygon {
        try {
            const i = intersect(intersec, p);
            if (i && i.geometry) {
                return i.geometry;
            }
        } catch (e) {
            if (!environment.production) {
                console.error(e);
            }
        }

        return p;
    }

    /**
     * dynamicLabelling
     * @param input input features
     * @param bound bounding box
     * @param idGetter identification getter
     * @param doNotDisplayGetter get property
     * @param doNotDisplay ignore features with property from doNotDisplayGetter
     * @param additional additional features
     * @returns features
     */
    public dynamicLabelling(
        input: Feature[],
        bound: Polygon,
        idGetter: (n: Feature) => string,
        doNotDisplayGetter: (n: Feature) => string,
        doNotDisplay: string[],
        additional: Array<Feature<Point>>): Array<Feature<Point>> {
        const featureMap: Record<string, Feature<Polygon>[]> = {};
        input.forEach(f => {
            if (!f || !f.geometry) {
                return;
            }

            let p: Polygon;

            switch (f.geometry.type) {
                case 'MultiPolygon':
                    p = this.getLargestPolygon(f.geometry);
                    break;
                case 'Polygon':
                    p = f.geometry;
                    break;
            }

            if (doNotDisplayGetter && doNotDisplay.includes(doNotDisplayGetter(f))) {
                return;
            }

            const id = idGetter(f);

            if (p && p.coordinates) {
                if (featureMap[id]) {
                    featureMap[id].push({
                        type: 'Feature',
                        geometry: p,
                        properties: f.properties,
                    });
                } else {
                    featureMap[id] = [{
                        type: 'Feature',
                        geometry: p,
                        properties: f.properties,
                    }];
                }
            }
        });

        const features: Array<Feature<Point>> = [];

        additional.forEach(a => {
            if (pointInPolygon(a, bound)) {
                features.push(a);
            }
        })

        // eslint-disable-next-line complexity
        Object.keys(featureMap).forEach(key => {
            let p: Polygon;

            featureMap[key].forEach(each => {
                try {
                    if (p && p.coordinates) {
                        const unionX = union(p, each);
                        switch (unionX.geometry.type) {
                            case 'Polygon':
                                p = unionX.geometry;
                                return;
                            case 'MultiPolygon':
                                p = this.getLargestPolygon(unionX.geometry);
                                return;
                        }
                    }
                    p = each.geometry;
                } catch (e) {
                    if (!environment.production) {
                        console.error(e);
                    }
                }
            });

            const i = this.intersectPolygon(p, bound);

            switch (i.type) {
                case 'Polygon':
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: polylabel(i.coordinates, 0.0001, false),
                        },
                        properties: featureMap[key][0].properties,
                    });
                    break;
                case 'MultiPolygon':
                    i.coordinates.map(f => ({
                        type: 'Polygon',
                        coordinates: f,
                    })).sort((i, j) => area(i) - area(j)).forEach(c => {
                        features.push({
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: polylabel(c.coordinates, 0.0001, false),
                            },
                            properties: featureMap[key][0].properties,
                        });
                    });
                    break;
            }
        });

        return features;
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
