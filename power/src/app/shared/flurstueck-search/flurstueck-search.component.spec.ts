import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeatureCollection } from 'geojson';
import { AlertsService } from '../alerts/alerts.service';
import { ModalComponent } from '../modal/modal.component';
import { SharedModule } from '../shared.module';
import { AlkisWfsService } from './alkis-wfs.service';
import { FlurstueckSearchComponent, Flurstueckskennzeichen } from './flurstueck-search.component';

describe('FlurstueckSearchComponent', () => {

    const fst: FeatureCollection = require('../../../assets/boden/flurstueck-search-samples/flurstueck.json');
    const emptyCollection: FeatureCollection = require('../../../assets/boden/flurstueck-search-samples/empty-collection.json');
    const fsk: Flurstueckskennzeichen = require('../../../assets/boden/flurstueck-search-samples/fsk.json');

    let component: FlurstueckSearchComponent;
    let fixture: ComponentFixture<FlurstueckSearchComponent>;

    let httpController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                FlurstueckSearchComponent,
                ModalComponent
            ],
            providers: [
                AlertsService,
                AlkisWfsService
            ],
            imports: [
                SharedModule,
                HttpClientTestingModule
            ]
        })
            .compileComponents();
        httpController = TestBed.inject(HttpTestingController);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlurstueckSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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
});
