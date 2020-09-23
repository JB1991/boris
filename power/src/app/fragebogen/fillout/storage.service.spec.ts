import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StorageService } from './storage.service';

describe('Fragebogen.Fillout.StorageService', () => {
    let service: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.inject(StorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.task).toBeNull();
        expect(service.form).toBeNull();
        expect(service.UnsavedChanges).toBeFalse();
    });

    it('should reset service', () => {
        service.form = { 'a': 1 };
        service.task = { 'b': 2 };
        service.resetService();
        expect(service.task).toBeNull();
        expect(service.form).toBeNull();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
