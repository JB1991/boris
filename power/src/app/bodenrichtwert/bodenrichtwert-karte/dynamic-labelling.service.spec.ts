import { TestBed } from '@angular/core/testing';

import { DynamicLabellingService } from './dynamic-labelling.service';

describe('DynamicLabellingService', () => {
    let service: DynamicLabellingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DynamicLabellingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
