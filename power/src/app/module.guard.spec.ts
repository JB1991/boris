import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModuleGuard } from './module.guard';
import { ConfigService } from './config.service';

describe('Shared.Auth.AuthGuard', () => {
    let guard: ModuleGuard;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                ConfigService
            ]
        });
        guard = TestBed.inject(ModuleGuard);
        spyOn(console, 'log');
        spyOn(guard.router, 'navigate');
    }));

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    it('should disable access', (done) => {
        // set config
        guard.config.config = { 'modules': ['forms', 'feedback'], 'authentication': true };

        guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: '/nipix' }).then((value) => {
            expect(value).toBeFalse();
            done();
        });
    });

    it('should allow access', (done) => {
        // set config
        guard.config.config = { 'modules': ['forms', 'feedback'], 'authentication': true };

        guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: '/forms/dashboard' }).then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
