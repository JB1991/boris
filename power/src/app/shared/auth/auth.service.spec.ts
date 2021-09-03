import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { AuthService, JWTToken, UserDetails } from './auth.service';

describe('Shared.Auth.AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: MockHomeComponent },
                    { path: 'home', component: MockHomeComponent }
                ])
            ]
        });
        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOn(console, 'error');
        spyOn(service.router, 'navigate');
        localStorage.removeItem('user');
        service.user = undefined;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.getUser()).toBeUndefined();
    });

    it('should getBearer correct', () => {
        // correct bearer
        service.user = { 'expires': new Date(), 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.getBearer()).toEqual('Bearer XXX');

        // token missing
        service.user = { 'expires': new Date(), 'token': {} as JWTToken, 'data': undefined };
        expect(service.getBearer()).toBeUndefined();
    });

    it('should getHeaders correct', () => {
        const expire = new Date();

        // check responsetype and content-type
        expire.setSeconds(expire.getSeconds() + 200);
        service.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.getHeaders('text', 'text/csv').responseType).toEqual('text');
        expect(service.getHeaders('text', 'text/csv').headers.get('Content-Type')).toEqual('text/csv');

        // valid session, auth header set
        expire.setSeconds(expire.getSeconds() + 200);
        service.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.getHeaders().headers.get('Authorization')).toEqual('Bearer XXX');

        // invalid session, no auth header
        expire.setSeconds(expire.getSeconds() - 800);
        service.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.getHeaders().headers.get('Authorization')).toBeNull();
    });

    it('should IsAuthEnabled correct', () => {
        // auth enabled
        environment.production = true;
        expect(service.IsAuthEnabled()).toBeTrue();

        // auth disabled
        environment.production = false;
        expect(service.IsAuthEnabled()).toBeFalse();
    });

    it('should IsAuthenticated correct', () => {
        environment.production = true;
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() + 900);

        // valid session
        service.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.IsAuthenticated()).toBeTrue();

        // expired session
        service.user = { 'expires': new Date(), 'token': { 'access_token': 'XXX' } as JWTToken, 'data': undefined };
        expect(service.IsAuthenticated()).toBeFalse();

        // invalid user object
        service.user = { 'expires': undefined, 'token': undefined, 'data': undefined };
        expect(service.IsAuthenticated()).toBeFalse();
    });

    it('should get token', (done) => {
        // get correct token
        void service.KeycloakToken('abc').then(() => {
            expect(service.getBearer()).toEqual('Bearer abc.e30=.123');
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST',
            { 'expires_in': 900, 'access_token': 'abc.e30=.123' });
    });

    it('should not get token', (done) => {
        // get error
        void service.KeycloakToken('abc').then(() => {
            expect(service.getBearer()).toBeUndefined();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', { 'error': 404 });
    });

    it('should not get token 2', (done) => {
        // get nothing
        void service.KeycloakToken('abc').then(() => {
            expect(service.getBearer()).toBeUndefined();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', null);
    });

    it('should not get token 3', (done) => {
        // get error status code
        void service.KeycloakToken('abc').then(() => {
            expect(service.getBearer()).toBeUndefined();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', 10,
            { status: 404, statusText: 'Not Found' });
    });

    it('should fail get token', (done) => {
        // throw error
        void service.KeycloakToken('').catch((value) => {
            expect(value.toString()).toEqual('Error: code is required');
            done();
        });
    });

    it('should load session', (done) => {
        // load valid session
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() + 200);
        localStorage.setItem('user', JSON.stringify({ 'expires': expire, 'token': { 'refresh_token': 'XXX' } }));

        void service.loadSession(false).then(() => {
            expect(service.IsAuthenticated()).toBeTrue();
            done();
        });
    });

    it('should refresh session', (done) => {
        // load expired session
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() - 200);
        localStorage.setItem('user', JSON.stringify({ 'expires': expire, 'token': { 'refresh_token': 'XXX' } }));

        void service.loadSession().then(() => {
            expect(service.IsAuthenticated()).toBeTrue();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST',
            { 'expires_in': 900, 'access_token': 'abc.e30=.123' });
    });

    it('should not refresh session', (done) => {
        // load expired session
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() - 200);
        localStorage.setItem('user', JSON.stringify({ 'expires': expire, 'token': { 'refresh_token': 'XXX' } }));

        void service.loadSession().then(() => {
            expect(service.IsAuthenticated()).toBeFalse();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', null);
    });

    it('should not refresh session 2', (done) => {
        // load expired session
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() - 200);
        localStorage.setItem('user', JSON.stringify({ 'expires': expire, 'token': { 'refresh_token': 'XXX' } }));

        void service.loadSession().then(() => {
            expect(service.IsAuthenticated()).toBeFalse();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', { 'error': 403 });
    });

    it('should not refresh session 3', (done) => {
        // load expired session
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() - 200);
        localStorage.setItem('user', JSON.stringify({ 'expires': expire, 'token': { 'refresh_token': 'XXX' } }));

        void service.loadSession().then(() => {
            expect(service.IsAuthenticated()).toBeFalse();
            done();
        });

        answerHTTPRequest(environment.auth.url + 'token', 'POST', 5,
            { status: 404, statusText: 'Not Found' });
    });

    it('should be authorized', () => {
        // auth disabled
        expect(service.IsAuthorized(['user'], 'abc', [])).toBeTrue();

        // auth enabled but not authenticated
        environment.production = true;
        expect(service.IsAuthorized(['user'], 'abc', [])).toBeFalse();

        // authenticated but no access
        const expire = new Date();
        expire.setSeconds(expire.getSeconds() + 900);
        service.user = { 'expires': expire, 'token': { 'access_token': 'XXX' } as JWTToken, 'data': {} as UserDetails };
        expect(service.IsAuthorized([], 'abc', [])).toBeFalse();

        // user is owner
        service.user.data = { groups: [], roles: [], sub: 'abc' } as unknown as UserDetails;
        expect(service.IsAuthorized([], 'abc', [])).toBeTrue();

        // user is in group
        service.user.data = { groups: ['toastbrot', 'aaa'], roles: ['xxx'], sub: 'abc' } as unknown as UserDetails;
        expect(service.IsAuthorized(['user'], '123', ['xxx', 'toastbrot'])).toBeTrue();

        // user is admin
        service.user.data = { groups: ['toastbrot', 'aaa'], roles: ['form_api_editor', 'form_api_admin'], sub: 'abc' } as unknown as UserDetails;
        expect(service.IsAuthorized(['user'], '123', ['xxx', 'toastbrot'])).toBeTrue();

        // user is manager
        service.user.data = { groups: ['toastbrot', 'aaa'], roles: ['form_api_manager', 'form_api_editor'], sub: 'abc' } as unknown as UserDetails;
        expect(service.IsAuthorized(['user', 'manager'], '123', ['xxx', 'toastbrot'])).toBeTrue();

        // user has no access
        service.user.data = { groups: [], roles: [], sub: 'abc' } as unknown as UserDetails;
        expect(service.IsAuthorized(['user'], '123', [])).toBeFalse();
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    const answerHTTPRequest = (url: string, method: string, body: any, opts?: any): void => {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    };

    const deepCopy = (data: any): any => JSON.parse(JSON.stringify(data));

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();

        // clear storage
        localStorage.removeItem('user');
        service.user = undefined;
        environment.production = false;
    });
});

@Component({
    selector: 'power-formulars-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
