import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeosearchService } from './geosearch.service';
import { Observable } from 'rxjs';
import { Feature, FeatureCollection } from 'geojson';

describe('Shared.Geosearch.GeosearchService', () => {
    const feature: Feature = require('../../../testdata/geosearch/feature.json');
    const featureCollection: FeatureCollection = require('../../../testdata/geosearch/featurecollection.json');

    const searchQuery = 'podbi';
    const searchUrl = '/geocoding/geosearch/?query=text:(' + searchQuery + ')%20AND%20(typ:ort%20OR%20typ:strasse%20OR%20typ:haus%5E0.2)%20AND%20(bundesland:Niedersachsen%20OR%20bundesland:Bremen)&minScore=1&count=10';
    let service: GeosearchService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GeosearchService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.inject(GeosearchService);
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

    it('search should return a feature collection', (done) => {
        service.search(searchQuery).subscribe(result => {
            expect(result.type).toEqual('FeatureCollection');
            expect(result.features.length).toEqual(10);
            done();
        });
        const request = httpController.expectOne(searchUrl);
        request.flush(featureCollection);
    });

    it('search should handle errors', (done) => {
        service.search(searchQuery).subscribe(() => {
        }, error => {
            expect(error.error.type).toEqual('error');
            done();
        });
        const request = httpController.expectOne(searchUrl);
        request.error(new ErrorEvent('error'));
    });

    it('getAddressFromCoordinates should return a feature collection', (done) => {
        const lat = 52.40739733323747;
        const lon = 9.80183706843431;
        const url = '/geocoding/geosearch/?query=typ:%20haus&lat=' + lat + '&lon=' + lon + '&distance=' + '50';

        service.getAddressFromCoordinates(lat, lon).subscribe(result => {
            expect(result.type).toEqual('FeatureCollection');
            expect(result.features.length).toEqual(10);
            done();
        });
        const request = httpController.expectOne(url);
        request.flush(featureCollection);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
