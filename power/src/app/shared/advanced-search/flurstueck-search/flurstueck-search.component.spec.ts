import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatureCollection, Feature } from 'geojson';
import { ModalModule } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AlertsService } from '../../alerts/alerts.service';
import { SharedModule } from '../../shared.module';
import { AlkisWfsService } from './alkis-wfs.service';
import { FlurstueckSearchComponent, Flurstueckskennzeichen } from './flurstueck-search.component';
import { GemarkungWfsService } from './gemarkung-wfs.service';

describe('FlurstueckSearchComponent', () => {

    const fst: FeatureCollection = require('../../../../testdata/flurstueck-search/flurstueck-collection.json');
    const emptyCollection: FeatureCollection = require('../../../../testdata/flurstueck-search/empty-collection.json');
    const fsk: Flurstueckskennzeichen = require('../../../../testdata/flurstueck-search/fsk.json');

    const gemarkungen: FeatureCollection = require('../../../../testdata/flurstueck-search/gemarkung-collection.json');
    const feature: Feature = require('../../../../testdata/flurstueck-search/gemarkung-feature.json');

    let component: FlurstueckSearchComponent;
    let fixture: ComponentFixture<FlurstueckSearchComponent>;

    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                FlurstueckSearchComponent
            ],
            providers: [
                AlertsService,
                AlkisWfsService,
                GemarkungWfsService
            ],
            imports: [
                SharedModule,
                ModalModule,
                HttpClientTestingModule,
                NgbTypeaheadModule
            ]
        }).compileComponents();

        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlurstueckSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset fsk and selected on reset', () => {
        component.selected = true;
        component.fsk = JSON.parse(JSON.stringify(fsk));
        component.reset();
        expect(component.selected).toBeFalse();
        expect(component.fsk).toEqual({});
    });

    it('searchFlurstueck should successfully call alkisWfsService', () => {
        spyOn(component.alkisWfsService, 'getFlurstueckByFsk').and.callThrough();
        component.searchFlurstueck(fsk);
        expect(component.alkisWfsService.getFlurstueckByFsk).toHaveBeenCalledTimes(1);
        expect(component.fsk).toEqual(fsk);
    });

    it('handleHttpResponse should handle and parse response', () => {
        spyOn(component.alkisWfsService, 'updateFeatures');
        component.handleHttpResponse(fst);
        expect(component.alkisWfsService.updateFeatures).toHaveBeenCalledTimes(1);
    });

    it('handleHttpResponse should not handle response if parsing fails', () => {
        spyOn(component.alerts, 'NewAlert');
        component.handleHttpResponse(emptyCollection);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Flurstück nicht gefunden.');
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

    it('search should successfully call the Geosearch service', () => {
        spyOn(component.gemarkungService, 'getGemarkungBySearchText').and.returnValue(of(gemarkungen));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('1205');
            expectObservable(component.search(input$));
        });
        expect(component.gemarkungService.getGemarkungBySearchText).toHaveBeenCalled();
    });

    it('search should unsuccessfully call the Geosearch service', () => {
        spyOn(component.gemarkungService, 'getGemarkungBySearchText').and.returnValue(throwError({ status: 404 }));

        testScheduler.run(({ expectObservable }) => {
            const input$ = of('podbi');
            expectObservable(component.search(input$));
        });
        expect(component.gemarkungService.getGemarkungBySearchText).toHaveBeenCalled();
    });

    it('selectItem selects an item from the result list', (done) => {
        spyOn(component.gemarkungService, 'updateFeatures');
        component.selectGemarkungResult.subscribe(next => {
            expect(next).toEqual(feature);
            done();
        });
        component.onSelect(feature);
        expect(component.gemarkungService.updateFeatures).toHaveBeenCalled();
        expect(component.inputFormatter(feature)).toEqual('Schwinge (1205) - Fredenbeck');
    });

    it('onEmpty should reset the selected variable if input field is empty', () => {
        component.selected = true;
        component.fsk = JSON.parse(JSON.stringify(fsk));
        component.onEmpty('Delete');
        expect(component.selected).toBeFalse();
    });

    it('onInput should set loading true if textLength > 0', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        input.value = 2;
        input.dispatchEvent(new Event('input'));

        expect(component.loading).toBeTrue();
    });
});
