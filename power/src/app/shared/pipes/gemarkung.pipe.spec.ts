import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GemarkungWfsService } from '@app/shared/advanced-search/flurstueck-search/gemarkung-wfs.service';
import { FeatureCollection } from 'geojson';
import { of } from 'rxjs';
import { GemarkungPipe } from './gemarkung.pipe';

describe('GemarkungPipe', () => {
    let pipe: GemarkungPipe;
    const gemarkungCollection: FeatureCollection = require('../../../testdata/flurstueck-search/gemarkung-collection.json');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                GemarkungPipe,
                GemarkungWfsService
            ]
        });

        pipe = TestBed.inject(GemarkungPipe);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should work', (done: DoneFn) => {
        spyOn(pipe.gemarkungService, 'getGemarkungByKey').and.returnValue(of(gemarkungCollection));
        pipe.transform('').subscribe((value) => {
            if (gemarkungCollection.features[0].properties) {
                expect(value).toBe(gemarkungCollection.features[0].properties['gemarkung']);
            }
            done();
        });
    });

    it('should not work', (done: DoneFn) => {
        spyOn(pipe.gemarkungService, 'getGemarkungByKey').and.returnValue(of({
            'type': 'FeatureCollection',
            'features': []
        } as any));
        pipe.transform('').subscribe((value) => {
            expect(value).toBe('');
            done();
        });
    });
});
