import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertsService } from '../alerts/alerts.service';
import { ModalComponent } from '../modal/modal.component';
import { SharedModule } from '../shared.module';
import { AlkisWfsService } from './alkis-wfs.service';
import { Flurstueck, FlurstueckSearchComponent, Flurstueckskennzeichen } from './flurstueck-search.component';

describe('FlurstueckSearchComponent', () => {

    const fst: Flurstueck = require('../../../assets/boden/flurstueck-search-samples/flurstueck.json');
    const fsk: Flurstueckskennzeichen = require('../../../assets/boden/flurstueck-search-samples/fsk.json');
    const xmlData: string =
        '<?xml version="1.0" encoding="utf-8"?><wfs:FeatureCollection>' +
        '<wfs:boundedBy>' +
        '<gml:Envelope srsName="urn:ogc:def:crs:EPSG::25832" srsDimension="2">' +
        '<gml:lowerCorner>602550.769 5783817.505</gml:lowerCorner>' +
        '<gml:upperCorner>602733.442 5784818.078</gml:upperCorner>' +
        '</gml:Envelope>' +
        '</wfs:boundedBy>' +
        '<wfs:member>' +
        '<AX_Flurstueck gml:id="DENIAL0100003W0J">' +
        '<gemarkung>' +
        '<AX_Gemarkung_Schluessel>' +
        '<land>03</land>' +
        '<gemarkungsnummer>5328</gemarkungsnummer>' +
        '</AX_Gemarkung_Schluessel>' +
        '</gemarkung>' +
        '<flurstuecksnummer>' +
        '<AX_Flurstuecksnummer>' +
        '<zaehler>79</zaehler>' +
        '<nenner>1</nenner>' +
        '</AX_Flurstuecksnummer>' +
        '</flurstuecksnummer>' +
        '<flurstueckskennzeichen>035328003000790001__</flurstueckskennzeichen>' +
        '<amtlicheFlaeche uom="urn:adv:uom:m2">25285.00</amtlicheFlaeche>' +
        '<flurnummer>3</flurnummer>' +
        '</AX_Flurstueck>' +
        '</wfs:member>' +
        '</wfs:FeatureCollection>';

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
        component.handleHttpResponse(xmlData);
        expect(component.alkisWfsService.updateFeatures).toHaveBeenCalledTimes(1);
    });

    it('handleHttpResponse should not handle response if parsing fails', () => {
        spyOn(component.alerts, 'NewAlert');
        component.handleHttpResponse('');
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
