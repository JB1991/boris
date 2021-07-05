import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageService } from './storage.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Editor.StorageService', () => {
    let service: StorageService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                AuthService
            ]
        });
        service = TestBed.inject(StorageService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should unsaved changes', () => {
        expect(service.getUnsavedChanges()).toBeFalse();
        service.setUnsavedChanges(true);
        expect(service.getUnsavedChanges()).toBeTrue();
        service.setUnsavedChanges(false);
        expect(service.getUnsavedChanges()).toBeFalse();
    });

    it('should auto save', () => {
        expect(service.getAutoSaveEnabled()).toBeTrue();
        service.setAutoSaveEnabled(false);
        expect(service.getAutoSaveEnabled()).toBeFalse();
        service.setAutoSaveEnabled(true);
        expect(service.getAutoSaveEnabled()).toBeTrue();
    });

    it('should get next page id', () => {
        // construct model
        service.model = {
            pages: [
                {
                    name: 'p1'
                }, {
                    name: 'p3'
                }
            ]
        };

        expect(service.newPageID()).toEqual('p2');
    });

    it('should get next element id', () => {
        // construct model
        service.model = {
            pages: [
                {
                    elements: [
                        { name: 'e1' },
                        { name: 'e2' }
                    ]
                }, {
                    elements: [
                        { name: 'e3' },
                        { name: 'e5' },
                    ]
                }
            ]
        };

        expect(service.newElementID()).toEqual('e4');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
