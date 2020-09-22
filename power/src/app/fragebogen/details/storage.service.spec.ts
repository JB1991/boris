import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageService } from './storage.service';

describe('Fragebogen.Details.StorageService', () => {
    let service: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: []
        });
        spyOn(console, 'log');
        service = TestBed.inject(StorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.form).toBeNull();
        expect(service.tasksList.length).toEqual(0);
    });

    it('should reset service', () => {
        service.form = { 'a': 1 };
        service.tasksList = [2, 5];
        service.tasksCountTotal = 2;
        service.resetService();
        expect(service.form).toBeNull();
        expect(service.tasksList.length).toEqual(0);
        expect(service.tasksCountTotal).toEqual(0);
    });

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
