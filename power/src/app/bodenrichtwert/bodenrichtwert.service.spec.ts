import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertService } from './bodenrichtwert.service';
import { Observable } from 'rxjs';
import { Feature, FeatureCollection } from 'geojson';
import { environment } from '@env/environment';

describe('Bodenrichtwert.BodenrichtwertService', () => {
    const feature: Feature = require('../../testdata/geosearch/feature.json');
    const features: FeatureCollection = require('../../testdata/geosearch/featurecollection.json');
    const featureByLatLonEntw: FeatureCollection = require('../../testdata/bodenrichtwert/feature-by-lat-lon-entw.json');

    const date = new Date('2018-12-31');
    const entw = ['B'];
    const lat = 52.40729;
    const lon = 9.80205;
    const url = environment.borisOws;

    let service: BodenrichtwertService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.inject(BodenrichtwertService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getFeatures should return an Observable', () => {
        expect(service.getFeatures()).toBeInstanceOf(Observable);
    });

    it('updateFeatures should feed the feature collection to the subject', (done) => {
        service.getFeatures().subscribe(next => {
            expect(next).toEqual(features);
            expect(next.type).toEqual('FeatureCollection');
            done();
        });
        service.updateFeatures(features);
    });

    it('getFeatureByLatLonEntw should return a feature', (done) => {
        service.getFeatureByLatLonEntw(lat, lon, entw).subscribe(next => {
            expect(next).toEqual(featureByLatLonEntw);
            expect(next.type).toEqual('FeatureCollection');
            done();
        });
        const request = httpTestingController.expectOne(url);
        request.flush(featureByLatLonEntw);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
