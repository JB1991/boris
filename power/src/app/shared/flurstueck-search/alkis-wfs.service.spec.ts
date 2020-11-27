import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { AlkisWfsService } from './alkis-wfs.service';
import { Flurstueck } from './flurstueck-search.component';
import * as XmlParser from 'fast-xml-parser';

describe('Shared.Flurstueck-search.AlkisWfsService', () => {
    const fst: Flurstueck = require('../../../assets/boden/flurstueck-search-samples/flurstueck.json');
    const xmlData: object = XmlParser.parse('../../../assets/boden/flurstueck-search-samples/xml-data.xml');

    const url = '/wfs?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&STOREDQUERY_ID=FstFsk&FSK=035328003000790001__';
    
    let service: AlkisWfsService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlkisWfsService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.inject(AlkisWfsService);
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
            expect(next).toEqual(fst);
            done();
        });
        service.updateFeatures(fst);
    });

    // it('search should return a feature collection', (done) => {
    //     service.getFlurstueckByFsk(fst.gemarkung, fst.flur, fst.zaehler, fst.nenner).subscribe(result => {
    //         expect(result).toEqual('text');
    //         done();
    //     });
    //     const request = httpController.expectOne(url);
    //     request.flush(xmlData);
    // });

    it('search should handle errors', (done) => {
        service.getFlurstueckByFsk(fst.gemarkung, fst.flur, fst.zaehler, fst.nenner).subscribe(() => {
        }, error => {
            expect(error.error.type).toEqual('error');
            done();
        });
        const request = httpController.expectOne(url);
        request.error(new ErrorEvent('error'));
    });
});