import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertService } from './bodenrichtwert.service';
import { Observable } from 'rxjs';
import { Feature, FeatureCollection } from 'geojson';

describe('Bodenrichtwert.BodenrichtwertService', () => {
    const feature: Feature = require('../../assets/boden/geosearch-samples/feature.json');
    const features: FeatureCollection = require('../../assets/boden/geosearch-samples/featurecollection.json');
    const featureByLatLonEntw: FeatureCollection = require('../../assets/boden/bodenrichtwert-samples/feature-by-lat-lon-entw.json');
    const featureByLatLonStagEntw: FeatureCollection = require('../../assets/boden/bodenrichtwert-samples/feature-by-lat-lon-stag-entw.json');
    const featureByObjektidentifikator: FeatureCollection = require('../../assets/boden/bodenrichtwert-samples/feature-by-objektidentifikator.json');
    const wfsCapabilities = require('!raw-loader!../../assets/boden/bodenrichtwert-samples/wfs-capabilities.xml');

    const date = new Date('2018-12-31');
    const entw = 'B';
    const lat = 52.40729;
    const lon = 9.80205;
    const url = '/geoserver/boris/ows?';

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

    it('getSelected should return an Observable', () => {
        expect(service.getSelected()).toBeInstanceOf(Observable);
    });

    it('updateSelected should feed the feature to the subject', (done) => {
        service.getSelected().subscribe(next => {
            expect(next).toEqual(feature);
            expect(next.type).toEqual('Feature');
            done();
        });
        service.updateSelected(feature);
    });

    it('getStichtag should return an Observable', () => {
        expect(service.getStichtag()).toBeInstanceOf(Observable);
    });

    it('updateStichtag should feed the date to the subject', (done) => {
        service.getStichtag().subscribe(next => {
            expect(next).toEqual(date);
            done();
        });
        service.updateStichtag(date);
    });

    it('getCapabilities should return an XML object with a list of WFS capabilities', (done) => {
        service.getCapabilities().subscribe(next => {
            expect(next).toContain('boris:br_brzone_flat');
            done();
        });
        const request = httpTestingController.expectOne(url);
        request.flush(wfsCapabilities);
    });

    it('getCapabilities should handle errors', (done) => {
        spyOn(console, 'error');
        service.getCapabilities().subscribe(() => {
        }, error => {
            expect(error).toEqual('Something bad happened; please try again later.');
            expect(console.error).toHaveBeenCalledTimes(1);
            done();
        });
        const request = httpTestingController.expectOne(url);
        request.error(new ErrorEvent('error'));
    });

    it('getFeatureByObjektidentifikator should return a feature collection', (done) => {
        service.getFeatureByObjektidentifikator('DENIBR0108B10007').subscribe(next => {
            expect(next).toEqual(featureByObjektidentifikator);
            expect(next.type).toEqual('FeatureCollection');
            done();
        });
        const request = httpTestingController.expectOne(url);
        request.flush(featureByObjektidentifikator);
    });

    it('getFeatureByLatLonStagEntw should return a feature collection', (done) => {
        service.getFeatureByLatLonStagEntw(lat, lon, date, entw).subscribe(next => {
            expect(next).toEqual(featureByLatLonStagEntw);
            expect(next.type).toEqual('FeatureCollection');
            done();
        });
        const request = httpTestingController.expectOne(url);
        request.flush(featureByLatLonStagEntw);
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
