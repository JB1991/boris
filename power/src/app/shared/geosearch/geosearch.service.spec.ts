import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeosearchService } from './geosearch.service';

describe('Shared.Geosearch.GeosearchService', () => {
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GeosearchService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', inject([GeosearchService], (service: GeosearchService) => {
        expect(service).toBeTruthy();
    }));
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
