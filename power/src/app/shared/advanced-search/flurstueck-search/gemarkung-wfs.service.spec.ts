/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { Feature, FeatureCollection } from 'geojson';
import { Observable } from 'rxjs';

import { GemarkungWfsService } from './gemarkung-wfs.service';

describe('GemarkungWfsService', () => {
    const feature: Feature = require('../../../../testdata/flurstueck-search/gemarkung-feature.json');
    const gemarkungCollection: FeatureCollection = require('../../../../testdata/flurstueck-search/gemarkung-collection.json');

    const searchText = '1205';
    const url = environment.alkisOws;

    let service: GemarkungWfsService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GemarkungWfsService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.inject(GemarkungWfsService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getFeatures should return an Observable', () => {
        expect(service.getFeatures()).toBeInstanceOf(Observable);
    });

    it('updateFeatures should feed the feature to the subject', (done) => {
        service.getFeatures().subscribe(next => {
            expect(next).toEqual(feature);
            done();
        });
        service.updateFeatures(feature);
    });

    it('getGemarkungByKey should return a feature collection', (done) => {
        service.getGemarkungBySearchText(searchText).subscribe(result => {
            expect(result.type).toEqual('FeatureCollection');
            expect(result.features.length).toEqual(1);
            done();
        });
        const request = httpController.expectOne(url);
        request.flush(gemarkungCollection);
    });

    it('getGemarkungBySearchText should return a feature collection', (done) => {
        service.getGemarkungBySearchText(searchText).subscribe(result => {
            expect(result.type).toEqual('FeatureCollection');
            expect(result.features.length).toEqual(1);
            done();
        });
        const request = httpController.expectOne(url);
        request.flush(gemarkungCollection);
    });

    it('getGemarkungBySearchText should handle errors', (done) => {
        service.getGemarkungBySearchText(searchText).subscribe(() => {
        }, error => {
            expect(error.error.type).toEqual('error');
            done();
        });
        const request = httpController.expectOne(url);
        request.error(new ErrorEvent('error'));
    });
});
