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
    localStorage.removeItem('user');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getUser()).toBeNull();
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
    environment.production = false;
  });
});

@Component({
  selector: 'power-formulars-home',
  template: ''
})
class MockHomeComponent {
}
