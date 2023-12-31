import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { GeosearchComponent } from './geosearch.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Feature, FeatureCollection } from 'geojson';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Shared.Geosearch.GeosearchComponent', () => {
    const feature: Feature = require('../../../testdata/geosearch/feature.json');
    const changedFeature: Feature = require('../../../testdata/geosearch/featureChange.json');

    const featureCollection: FeatureCollection = require('../../../testdata/geosearch/featurecollection.json');

    let component: GeosearchComponent;
    let fixture: ComponentFixture<GeosearchComponent>;
    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                GeosearchComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
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
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work', () => {
        component.model = feature;
        component.ngOnChanges({
            address: new SimpleChange(null, changedFeature, false)
        });
        expect(component.model).toEqual(changedFeature);
    });

    it('selectItem selects an item from the result list', (done) => {
        spyOn(component.geosearchService, 'updateFeatures');
        component.selectResult.subscribe((next) => {
            expect(next).toEqual(feature);
            done();
        });
        component.onSelect(feature);
        expect(component.geosearchService.updateFeatures).toHaveBeenCalled();
        expect(component.inputFormatter(feature)).toEqual('Podbielskistraße 331, 30659 Hannover - Bothfeld');
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

    it('onInput should set loading true if textLength > 0', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        input.value = 2;
        input.dispatchEvent(new Event('input'));

        expect(component.loading).toBeTrue();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
