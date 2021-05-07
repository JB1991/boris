import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SEOService } from './seo.service';

describe('SEOService', () => {
    let service: SEOService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ]
        });
        service = TestBed.inject(SEOService);
        spyOn(console, 'error');
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
