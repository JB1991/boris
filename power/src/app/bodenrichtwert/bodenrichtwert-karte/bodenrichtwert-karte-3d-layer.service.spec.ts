import { TestBed } from '@angular/core/testing';

import { BodenrichtwertKarte3dLayerService } from './bodenrichtwert-karte-3d-layer.service';

describe('BodenrichtwertKarte3dLayerService', () => {
    let service: BodenrichtwertKarte3dLayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BodenrichtwertKarte3dLayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
