import { TestBed } from '@angular/core/testing';

import { DynamicLabellingService } from './dynamic-labelling.service';
import { Feature, Point } from 'geojson';

const f1: Feature = {
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [[[9.742808416485786, 52.413731409786635],
            [9.743504449725151, 52.413731409786635],
            [9.743504449725151, 52.41330685860237],
            [9.742808416485786, 52.41330685860237],
            [9.742808416485786, 52.413731409786635]]],
    },
    properties: {
        brw: '270.0',
        brzname: 'Vahrenheide',
        objid: 'DENIBR4321B04151',
        stag: '2020-12-31',
        wnum: '04304151',
    }
}

const f2: Feature = {
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [[[9.742808416485786, 52.413731409786635],
            [9.743504449725151, 52.413731409786635],
            [9.743504449725151, 52.41330685860237],
            [9.742808416485786, 52.41330685860237],
            [9.742808416485786, 52.413731409786635]]],
    },
    properties: {
        brw: '270.0',
        brzname: 'Vahrenheide',
        objid: 'DENIBR4321B04151',
        stag: '2020-12-31',
        wnum: '123',
    }
}

const f3: Feature = {
    type: 'Feature',
    geometry: {
        type: 'MultiPolygon',
        coordinates: [[[[9.742808416485786, 52.413731409786635],
            [9.743504449725151, 52.413731409786635],
            [9.743504449725151, 52.41330685860237],
            [9.742808416485786, 52.41330685860237],
            [9.742808416485786, 52.413731409786635]]]],
    },
    properties: {
        brw: '270.0',
        brzname: 'Vahrenheide',
        objid: 'DENIBR4321B04151',
        stag: '2020-12-31',
        wnum: '123',
    }
}

const p1: Feature<Point> = {
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [9.7433832, 52.4134995],
    },
    properties: {}
}

describe('DynamicLabellingService', () => {
    let service: DynamicLabellingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DynamicLabellingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should just work', () => {
        const features = service.dynamicLabelling(
            [f1, f1, f2, f3, null],
            {
                type: 'Polygon',
                coordinates:   [[[9.743262034291547, 52.413328634053244],
                    [9.743262034291547, 52.41367056560179],
                    [9.743692528838665, 52.41367056560179],
                    [9.743692528838665, 52.413328634053244],
                    [9.743262034291547, 52.413328634053244]]],
            },
            (f) => f.properties.brw,
            (f) => f.properties.wnum,
            ['123'],
            [p1]);
        expect(features[1].geometry.coordinates[0]).toEqual(9.743383242008349);
        expect(features[1].geometry.coordinates[1]).toEqual(52.41349959982752);
    });

    it('should create image', () => {
        const image = service.createLineImage(1);
        expect(image.data[1]).toEqual(0);
        expect(image.data[10]).toEqual(255);
    });

    it('should generate point features', () => {
        const features = service.generatePointFeatures([{lng: 10, lat: 20, properties: {no: 'thing'}}]);
        expect(features).toEqual([
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [10, 20]
                },
                properties: {
                    no: 'thing',
                }
            }
        ]);
    })
});
