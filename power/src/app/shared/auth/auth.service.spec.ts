import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { AuthService } from './auth.service';
import { ConfigService } from '@app/config.service';
import { AlertsService } from '../alerts/alerts.service';

describe('Shared.Auth.AlertsService', () => {
  let service: AuthService;
  let alerts: jasmine.SpyObj<AlertsService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
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
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        }
      ]
    });
    service = TestBed.inject(AuthService);
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    spyOn(console, 'log');
    spyOn(service.router, 'navigate');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getUser()).toBeNull();
  });

  it('should get user', () => {
    service.user = {'username': 'Heinrich', 'token': 5};
    expect(service.getUser()).toEqual(service.user);
  });

  it('should login', () => {
    service.login('Helmut', 'password', '/forms/dashboard');
    answerHTTPRequest(environment.auth.apiurl, 'POST', {'x': 7});
    expect(service.user.username).toEqual('Helmut');
  });

  it('should fail login', () => {
    service.login('Gertrud', '123456', '/forms/dashboard');
    answerHTTPRequest(environment.auth.apiurl, 'POST',
                      {'error': 'Internal Server Error'});
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Login fehlgeschlagen', 'Internal Server Error');

    service.login('Hermann', 'qwertz', '');
    answerHTTPRequest(environment.auth.apiurl, 'POST', null);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(2);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Login fehlgeschlagen', 'Unknown');
  });

  it('should fail login 404', () => {
    service.login('Herbert', 'Herbert');
    answerHTTPRequest(environment.auth.apiurl, 'POST', 5,
                      { status: 404, statusText: 'Not Found' });
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Login fehlgeschlagen', 'Not Found');
  });

  it('should crash login', () => {
    expect(function () {
      service.login('', '1234');
    }).toThrowError('username is required');
    expect(function () {
      service.login('Ingrit', null);
    }).toThrowError('password is required');
  });

  it('should logout', () => {
    service.user = {'username': 'Klaus', 'token': 4};
    service.logout();
    expect(service.getUser()).toBeNull();
  });

  it('should be enabled', () => {
    expect(service.IsAuthEnabled()).toBeFalse();

    service.conf.config = {'modules': [], 'authentication': true};
    environment.production = true;
    expect(service.IsAuthEnabled()).toBeTrue();
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
    localStorage.clear();
    environment.production = false;
  });
});

@Component({
  selector: 'power-formulars-home',
  template: ''
})
class MockHomeComponent {
}
