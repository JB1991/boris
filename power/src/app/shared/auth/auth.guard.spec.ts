import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('Shared.Auth.AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'login', component: MockLoginComponent }
                ])
            ],
            providers: [
                AuthService,
                AlertsService
            ]
        });
        guard = TestBed.inject(AuthGuard);
        spyOn(console, 'error');
        spyOn(guard.router, 'navigate');
        localStorage.removeItem('user');
        guard.auth.user = null;
    }));

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    it('should open in dev', (done) => {
        // auth disabled
        guard.auth.conf.config = { 'modules': [], 'authentication': false };
        environment.production = true;
        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/private' } as RouterStateSnapshot).then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });

    it('should open in dev 2', (done) => {
        // not in production
        guard.auth.conf.config = { 'modules': [], 'authentication': true };
        environment.production = false;
        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/private' } as RouterStateSnapshot).then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });

    it('should deny access', (done) => {
        // unauthorized
        guard.auth.conf.config = { 'modules': [], 'authentication': true };
        environment.production = true;
        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/private' } as RouterStateSnapshot).then((value) => {
            expect(value).toBeFalse();
            done();
        });
    });

    it('should allow access', (done) => {
        // authorized
        guard.auth.conf.config = { 'modules': [], 'authentication': true };
        environment.production = true;
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() + 900);
        guard.auth.user = { 'expires': expire, 'token': 6, 'data': null };

        guard.canActivate(new ActivatedRouteSnapshot(), { url: '/private' } as RouterStateSnapshot).then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });

    afterEach(() => {
        // clear storage
        localStorage.removeItem('user');
        guard.auth.user = null;
        environment.production = false;
    });
});

@Component({
    selector: 'power-login',
    template: ''
})
class MockLoginComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
