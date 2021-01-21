import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FeatureCollection } from 'geojson';

import { GemarkungWfsService } from './gemarkung-wfs.service';

describe('GemarkungWfsService', () => {
    const fst: FeatureCollection = require('../../../assets/boden/flurstueck-search-samples/flurstueck.json');

    const url = '/geoserver/alkis/ows?';

    let service: GemarkungWfsService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GemarkungWfsService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.inject(GemarkungWfsService);
        httpController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
