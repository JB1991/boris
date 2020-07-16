import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';
import { environment } from '@env/environment';

describe('Fragebogen.Fillout.StorageService', () => {
  let service: StorageService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../assets/fragebogen/form-sample.json');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(StorageService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.task).toBeNull();
    expect(service.form).toBeNull();
    expect(service.UnsavedChanges).toBeFalse();
  });
  it('should load form', () => {
    service.loadForm('123').subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'public/forms/123', 'GET', formSample);
  });
  it('should set unsavedchanges', () => {
    expect(service.getUnsavedChanges()).toBeFalse();
    service.setUnsavedChanges(true);
    expect(service.getUnsavedChanges()).toBeTrue();
  });
  it('should reset service', () => {
    service.form = {'a': 1};
    service.task = {'b': 2};
    service.resetService();
    expect(service.task).toBeNull();
    expect(service.form).toBeNull();
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
  });
});
