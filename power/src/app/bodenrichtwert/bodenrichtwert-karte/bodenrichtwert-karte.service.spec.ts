import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BodenrichtwertKarteService } from './bodenrichtwert-karte.service';

describe('BodenrichtwertKarteService', () => {
    let service: BodenrichtwertKarteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BodenrichtwertKarteService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.inject(BodenrichtwertKarteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
