/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { AlkisWfsService } from './alkis-wfs.service';
import { FeatureCollection } from 'geojson';
import { environment } from '@env/environment';

describe('Shared.Flurstueck-search.AlkisWfsService', () => {
    const fst: FeatureCollection = require('../../../../testdata/flurstueck-search/flurstueck-collection.json');

    const url = environment.alkisOws;

    let service: AlkisWfsService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlkisWfsService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.inject(AlkisWfsService);
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
        service.getFeatures().subscribe((next) => {
            expect(next).toEqual(fst);
            done();
        });
        service.updateFeatures(fst);
    });

    it('search should handle errors', (done) => {
        service.getFlurstueckByFsk('1205', '5', '113', '37').subscribe(() => {
        }, (error) => {
            expect(error.error.type).toEqual('error');
            done();
        });
        const request = httpController.expectOne(url);
        request.error(new ErrorEvent('error'));
    });
});
