import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Feature } from '@turf/turf';
import { FeatureCollection } from 'geojson';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AlertsService } from '../alerts/alerts.service';
import { ModalComponent } from '../modal/modal.component';
import { SharedModule } from '../shared.module';
import { AlkisWfsService } from './alkis-wfs.service';
import { FlurstueckSearchComponent, Flurstueckskennzeichen } from './flurstueck-search.component';
import { GemarkungWfsService } from './gemarkung-wfs.service';

describe('FlurstueckSearchComponent', () => {

    const fst: FeatureCollection = require('../../../testdata/flurstueck-search/flurstueck-collection.json');
    const emptyCollection: FeatureCollection = require('../../../testdata/flurstueck-search/empty-collection.json');
    const fsk: Flurstueckskennzeichen = require('../../../testdata/flurstueck-search/fsk.json');

    const gemarkungen: FeatureCollection = require('../../../testdata/flurstueck-search/gemarkung-collection.json');
    const feature: Feature = require('../../../testdata/flurstueck-search/gemarkung-feature.json');

    let component: FlurstueckSearchComponent;
    let fixture: ComponentFixture<FlurstueckSearchComponent>;

    let httpController: HttpTestingController;
    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                FlurstueckSearchComponent,
                ModalComponent
            ],
            providers: [
                AlertsService,
                AlkisWfsService,
                GemarkungWfsService
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
        fixture = TestBed.createComponent(FlurstueckSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onClose should reset fsk', () => {
        component.fsk = fsk;
        component.onClose();
        expect(component.fsk).toEqual({});
    });

    it('searchFlurstueck should successfully call alkisWfsService', () => {
        spyOn(component.alkisWfsService, 'getFlurstueckByFsk').and.callThrough();
        spyOn(component.modal, 'close');
        component.searchFlurstueck(fsk);
        expect(component.alkisWfsService.getFlurstueckByFsk).toHaveBeenCalledTimes(1);
        expect(component.modal.close).toHaveBeenCalledTimes(1);
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
        component.selectResult.subscribe(next => {
            expect(next).toEqual(feature);
            done();
        });
        component.onSelect(feature);
        expect(component.gemarkungService.updateFeatures).toHaveBeenCalled();
        expect(component.inputFormatter(feature)).toEqual('Schwinge (1205) - Fredenbeck');
    });
});
