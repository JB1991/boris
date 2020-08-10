import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { AppModule, load } from './app.module';
import { ConfigService } from '@app/config.service';

describe('AppModule', () => {
  let appModule: AppModule;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    spyOn(console, 'log');
    spyOn(console, 'error');
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    appModule = new AppModule();
  }));

  it('should create an instance', () => {
    expect(appModule).toBeTruthy();
  });

  it('should load config', (done) => {
    // create request
    const confsrv = new ConfigService();
    load(httpClient, confsrv)().then((value) => {
      expect(value.valueOf()).toBeTrue();
      done();
    });

    // answer http request
    const req = httpTestingController.expectOne('./assets/config/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush({});
    httpTestingController.verify();
  });

  it('should load config', (done) => {
    // create request
    const confsrv = new ConfigService();
    load(httpClient, confsrv)().then((value) => {
      expect(value.valueOf()).toBeTrue();
      done();
    });

    // answer http request
    const req = httpTestingController.expectOne('./assets/config/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush({});
    httpTestingController.verify();
  });

  it('should fail load config', (done) => {
    // create request
    const confsrv = new ConfigService();
    load(httpClient, confsrv)().then((value) => {
      expect(value.valueOf()).toBeTrue();
      done();
    });

    // answer http request
    const req = httpTestingController.expectOne('./assets/config/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush({}, { status: 404, statusText: 'Not Found' });
    httpTestingController.verify();
  });

  it('should fail load config 2', (done) => {
    // create request
    const confsrv = new ConfigService();
    load(httpClient, confsrv)().then((value) => {
      expect(value.valueOf()).toBeFalse();
      done();
    });

    // answer http request
    const req = httpTestingController.expectOne('./assets/config/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    httpTestingController.verify();
  });
});
