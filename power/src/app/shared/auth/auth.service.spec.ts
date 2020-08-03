import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { AuthService } from './auth.service';
import { ConfigService } from '@app/config.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('Shared.Auth.AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent},
          { path: 'home', component: MockHomeComponent}
        ])
      ],
      providers: [
        ConfigService,
        AlertsService
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    spyOn(console, 'log');
    spyOn(service.router, 'navigate');
    spyOn(service.alerts, 'NewAlert');
    localStorage.removeItem('user');
    service.user = null;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getUser()).toBeNull();
  });

  it('should getBearer correct', () => {
    // correct bearer
    service.user = {'expires': new Date(), 'token': {'access_token': 'XXX'}, 'data': null};
    expect(service.getBearer()).toEqual('Bearer XXX');

    // token missing
    service.user = {'expires': new Date(), 'token': {}, 'data': null};
    expect(service.getBearer()).toBeNull();
  });

  it('should getHeaders correct', () => {
    const expire = new Date();

    // check responsetype and content-type
    expire.setSeconds(expire.getSeconds() + 200);
    service.user = {'expires': expire, 'token': {'access_token': 'XXX'}, 'data': null};
    expect(service.getHeaders('text', 'text/csv').responseType).toEqual('text');
    expect(service.getHeaders('text', 'text/csv').headers.get('Content-Type')).toEqual('text/csv');

    // valid session, auth header set
    expire.setSeconds(expire.getSeconds() + 200);
    service.user = {'expires': expire, 'token': {'access_token': 'XXX'}, 'data': null};
    expect(service.getHeaders().headers.get('Authorization')).toEqual('Bearer XXX');

    // invalid session, no auth header
    expire.setSeconds(expire.getSeconds() - 800);
    service.user = {'expires': expire, 'token': {'access_token': 'XXX'}, 'data': null};
    expect(service.getHeaders().headers.get('Authorization')).toBeNull();
  });

  it('should IsAuthEnabled correct', () => {
    // auth enabled
    service.conf.config = {'modules': [], 'authentication': true};
    environment.production = true;
    expect(service.IsAuthEnabled()).toBeTrue();

    // auth disabled
    service.conf.config = {'modules': [], 'authentication': false};
    environment.production = true;
    expect(service.IsAuthEnabled()).toBeFalse();

    // auth disabled, non-production
    service.conf.config = {'modules': [], 'authentication': true};
    environment.production = false;
    expect(service.IsAuthEnabled()).toBeFalse();
  });

  it('should IsAuthenticated correct', () => {
    service.conf.config = {'modules': [], 'authentication': true};
    environment.production = true;
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 900);

    // valid session
    service.user = {'expires': expire, 'token': 6, 'data': null};
    expect(service.IsAuthenticated()).toBeTrue();

    // expired session
    service.user = {'expires': new Date(), 'token': 6, 'data': null};
    expect(service.IsAuthenticated()).toBeFalse();

    // invalid user object
    service.user = {'expires': null, 'token': null, 'data': null};
    expect(service.IsAuthenticated()).toBeFalse();
  });

  it('should get token', (done) => {
    // get correct token
    service.KeycloakToken('abc').then((value) => {
      expect(service.getBearer()).toEqual('Bearer XXX');
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', {'expires_in': 900, 'access_token': 'XXX'});
  });

  it('should not get token', (done) => {
    // get error
    service.KeycloakToken('abc').then((value) => {
      expect(service.getBearer()).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', {'error': 404});
  });

  it('should not get token 2', (done) => {
    // get nothing
    service.KeycloakToken('abc').then((value) => {
      expect(service.getBearer()).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', null);
  });

  it('should not get token 3', (done) => {
    // get error status code
    service.KeycloakToken('abc').then((value) => {
      expect(service.getBearer()).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', 10,
                      { status: 404, statusText: 'Not Found' });
  });

  it('should fail get token', (done) => {
    // throw error
    service.KeycloakToken('').catch((value) => {
      expect(value.toString()).toEqual('Error: code is required');
      done();
    });
  });

  it('should get user info', (done) => {
    // get user info
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 900);
    service.user = {'expires': expire, 'token': {'access_token': 'abc'}, 'data': null};
    service.KeyLoakUserInfo().then((value) => {
      expect(service.user.data).toEqual({'name': 'Miau'});
      done();
    });

    answerHTTPRequest(environment.auth.url + 'userinfo', 'GET', {'name': 'Miau'});
  });

  it('should not get user info', (done) => {
    // get error
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 900);
    service.user = {'expires': expire, 'token': {'access_token': 'abc'}, 'data': null};
    service.KeyLoakUserInfo().then((value) => {
      expect(service.user.data).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'userinfo', 'GET', {'error': 404});
  });

  it('should not get user info 2', (done) => {
    // get nothing
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 900);
    service.user = {'expires': expire, 'token': {'access_token': 'abc'}, 'data': null};
    service.KeyLoakUserInfo().then((value) => {
      expect(service.user.data).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'userinfo', 'GET', null);
  });

  it('should not get user info 3', (done) => {
    // get error status code
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 900);
    service.user = {'expires': expire, 'token': {'access_token': 'abc'}, 'data': null};
    service.KeyLoakUserInfo().then((value) => {
      expect(service.user.data).toBeNull();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'userinfo', 'GET', 10,
                      { status: 404, statusText: 'Not Found' });
  });

  it('should load session', (done) => {
    // load valid session
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 200);
    localStorage.setItem('user', JSON.stringify({'expires': expire, 'token': {'refresh_token': 'XXX'}}));

    service.loadSession(false).then((value) => {
      expect(service.IsAuthenticated()).toBeTrue();
      done();
    });
  });

  it('should refresh session', (done) => {
    // load expired session
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() - 200);
    localStorage.setItem('user', JSON.stringify({'expires': expire, 'token': {'refresh_token': 'XXX'}}));

    service.loadSession().then((value) => {
      expect(service.IsAuthenticated()).toBeTrue();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', {'expires_in': 900, 'access_token': 'XXX'});
  });

  it('should not refresh session', (done) => {
    // load expired session
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() - 200);
    localStorage.setItem('user', JSON.stringify({'expires': expire, 'token': {'refresh_token': 'XXX'}}));

    service.loadSession().then((value) => {
      expect(service.IsAuthenticated()).toBeFalse();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', null);
  });

  it('should not refresh session 2', (done) => {
    // load expired session
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() - 200);
    localStorage.setItem('user', JSON.stringify({'expires': expire, 'token': {'refresh_token': 'XXX'}}));

    service.loadSession().then((value) => {
      expect(service.IsAuthenticated()).toBeFalse();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', {'error': 403});
  });

  it('should not refresh session 3', (done) => {
    // load expired session
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() - 200);
    localStorage.setItem('user', JSON.stringify({'expires': expire, 'token': {'refresh_token': 'XXX'}}));

    service.loadSession().then((value) => {
      expect(service.IsAuthenticated()).toBeFalse();
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', 5,
                      { status: 404, statusText: 'Not Found' });
  });

  /**
   * Mocks the API by taking HTTP requests form the queue and returning the answer
   * @param url The URL of the HTTP request
   * @param method HTTP request method
   * @param body The body of the answer
   * @param opts Optional HTTP information of the answer
   */
  function answerHTTPRequest(url, method, body, opts?) {
    // Take HTTP request from queue
    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toEqual(method);

    // Return the answer
    request.flush(deepCopy(body), opts);
  }

  function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  afterEach(() => {
    // Verify that no requests are remaining
    httpTestingController.verify();

    // clear storage
    localStorage.removeItem('user');
    service.user = null;
    environment.production = false;
  });
});

@Component({
  selector: 'power-formulars-home',
  template: ''
})
class MockHomeComponent {
}
