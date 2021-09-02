import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { AuthGuard } from './auth.guard';
import { AuthService, JWTToken } from './auth.service';
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
        guard.auth.user = undefined;
    }));

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    it('should open in dev', (done) => {
        // not in production
        environment.production = false;
        void guard.canActivate().then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });

    it('should deny access', (done) => {
        // unauthorized
        environment.production = true;
        void guard.canActivate().then((value) => {
            expect(value).toBeFalse();
            done();
        });
    });

    it('should allow access', (done) => {
        // authorized
        environment.production = true;
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() + 900);
        guard.auth.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };

        void guard.canActivate().then((value) => {
            expect(value).toBeTrue();
            done();
        });
    });

    afterEach(() => {
        // clear storage
        localStorage.removeItem('user');
        guard.auth.user = undefined;
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
