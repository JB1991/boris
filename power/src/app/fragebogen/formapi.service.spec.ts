import { TestBed } from '@angular/core/testing';

import { FormAPIService } from './formapi.service';

describe('FormapiService', () => {
    let service: FormAPIService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormAPIService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
