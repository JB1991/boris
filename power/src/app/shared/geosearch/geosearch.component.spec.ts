import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeosearchComponent } from './geosearch.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Feature, FeatureCollection } from 'geojson';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('Shared.Geosearch.GeosearchComponent', () => {
    const feature: Feature = require('../../../assets/boden/geosearch-samples/feature.json');
    const changedFeature: Feature = require('../../../assets/boden/geosearch-samples/featureChange.json');

    const featureCollection: FeatureCollection = require('../../../assets/boden/geosearch-samples/featurecollection.json');

    let component: GeosearchComponent;
    let fixture: ComponentFixture<GeosearchComponent>;
    let httpTestingController: HttpTestingController;
    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeosearchComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
                NgbTypeaheadModule
            ]
        }).compileComponents();

        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeosearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work', () => {
        component.model = feature;
        component.ngOnChanges({
            adresse: new SimpleChange(null, changedFeature, false)
        });
        expect(component.model).toEqual(changedFeature);
    });

    it('selectItem selects an item from the result list', (done) => {
        spyOn(component.geosearchService, 'updateFeatures');
        component.selectResult.subscribe(next => {
            expect(next).toEqual(feature);
            done();
        });
        component.onSelect(feature);
        expect(component.geosearchService.updateFeatures).toHaveBeenCalled();
        expect(component.inputFormatter(feature)).toEqual('Podbielskistraße 331, 30659 Hannover - Bothfeld');
    });

    it('formatter should return the text property', () => {
        expect(component.resultFormatter(feature)).toEqual('Podbielskistraße 331, 30659 Hannover - Bothfeld');
    });

    it('search should successfully call the Geosearch service', () => {
        spyOn(component.geosearchService, 'search').and.returnValue(of(featureCollection));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('podbi');
            expectObservable(component.search(input$));
        });
        expect(component.geosearchService.search).toHaveBeenCalled();
    });

    it('search should unsuccessfully call the Geosearch service', () => {
        spyOn(component.geosearchService, 'search').and.returnValue(throwError({ status: 404 }));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('podbi');
            expectObservable(component.search(input$));
        });
        expect(component.geosearchService.search).toHaveBeenCalled();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
