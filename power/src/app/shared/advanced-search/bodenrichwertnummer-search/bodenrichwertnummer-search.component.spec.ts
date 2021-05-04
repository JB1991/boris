import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Teilmarkt } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatureCollection } from 'geojson';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { BodenrichwertnummerSearchComponent } from './bodenrichwertnummer-search.component';

describe('BodenrichwertnummerSearchComponent', () => {
    const brw: FeatureCollection = require('../../../../testdata/bodenrichtwert/feature-by-lat-lon-entw.json');
    const emptyCollection: FeatureCollection = require('../../../../testdata/flurstueck-search/empty-collection.json');
    const brwSearch: FeatureCollection = require('../../../../testdata/bodenrichtwert/bodenrichtwert-nummer-search.json');

    const teilmarkt: Teilmarkt = {
        value: ['B'],
        text: 'Bauland',
        hexColor: '#11234'
    };

    let component: BodenrichwertnummerSearchComponent;
    let fixture: ComponentFixture<BodenrichwertnummerSearchComponent>;

    let httpController: HttpTestingController;
    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichwertnummerSearchComponent
            ],
            providers: [
                AlertsService,
                BodenrichtwertService
            ],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                NgbTypeaheadModule
            ]
        }).compileComponents();

        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichwertnummerSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.teilmarkt = teilmarkt;

        httpController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset brwNummer on reset', () => {
        component.brwNummer = JSON.parse(JSON.stringify(brw));
        component.reset();
        expect(component.brwNummer).toBeUndefined();
    });

    it('searchBodenrichtwert should successfully call bodenrichtwertService', () => {
        spyOn(component.bodenrichtwertService, 'getFeatureByLatLonEntw').and.callThrough();
        const brwNummer = JSON.parse(JSON.stringify(brw));
        component.searchBodenrichtwert(brwNummer.features[0]);
        expect(component.bodenrichtwertService.getFeatureByLatLonEntw).toHaveBeenCalledTimes(1);
    });

    it('handleHttpResponse should handle and parse response', () => {
        spyOn(component.bodenrichtwertService, 'updateFeatures');
        component.handleHttpResponse(brw);
        expect(component.bodenrichtwertService.updateFeatures).toHaveBeenCalledTimes(1);
    });

    it('handleHttpResponse should not handle response if parsing fails', () => {
        spyOn(component.alerts, 'NewAlert');
        component.handleHttpResponse(emptyCollection);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Bodenrichtwertzone nicht gefunden.');
    });

    it('handleHttpError should handle error', () => {
        spyOn(component.alerts, 'NewAlert');
        component.handleHttpError(new HttpErrorResponse({ statusText: 'error' }));
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith(
            'danger',
            'Laden fehlgeschlagen',
            'Anfrage an die WFS-Komponente gescheitert, bitte versuchen Sie es später erneut.'
        );
    });

    it('search should successfully call the bodenrichtwert service', () => {
        spyOn(component.bodenrichtwertService, 'getFeatureByBRWNumber').and.returnValue(of(brwSearch));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('03400046');
            expectObservable(component.search(input$));
        });
        expect(component.bodenrichtwertService.getFeatureByBRWNumber).toHaveBeenCalled();
    });

    it('search should unsuccessfully call the bodenrichtwert service', () => {
        spyOn(component.bodenrichtwertService, 'getFeatureByBRWNumber').and.returnValue(throwError({ status: 404 }));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('podbi');
            expectObservable(component.search(input$));
        });
        expect(component.bodenrichtwertService.getFeatureByBRWNumber).toHaveBeenCalled();
    });

    it('onInput should set loading true if textLength > 0', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        input.value = 2;
        input.dispatchEvent(new Event('input'));

        expect(component.loading).toBeTrue();
    });
});
