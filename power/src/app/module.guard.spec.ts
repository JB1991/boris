import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModuleGuard } from './module.guard';
import { environment } from '@env/environment';

describe('Shared.Auth.AuthGuard', () => {
    let guard: ModuleGuard;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ]
        });
        guard = TestBed.inject(ModuleGuard);
        spyOn(console, 'error');
        spyOn(guard.router, 'navigate');
    }));

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    it('should disable access', (done) => {
        // set config
        environment.config = { modules: ['forms', 'feedback'], localized: false, languages: [], version: { version: '', branch: '' } };

        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/nipix' } as RouterStateSnapshot).then((value) => {
            expect(value).toBeFalse();
            done();
        });
    });

    it('should allow access', (done) => {
        // set config
        environment.config = { modules: ['forms', 'feedback'], localized: false, languages: [], version: { version: '', branch: '' } };

        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/forms/dashboard' } as RouterStateSnapshot)
            .then((value) => {
                expect(value).toBeTrue();
                done();
            });
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
