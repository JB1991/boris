import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Editor.StorageService', () => {
  let service: StorageService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../assets/fragebogen/form-sample.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(StorageService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a form', () => {
    service.loadForm('123').subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);

    // return error
    expect(function () {
      service.loadForm(null);
    }).toThrowError('id is required');
  });

  it('should save a form', () => {
    service.saveForm(formSample, '123').subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'POST', formSample);

    // with tags
    service.saveForm(formSample, '123', ['xxx']).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'intern/forms/123?tags=xxx', 'POST', formSample);

    // return error
    expect(function () {
      service.saveForm(null, '123');
    }).toThrowError('data is required');
    expect(function () {
      service.saveForm('msg', '');
    }).toThrowError('id is required');
  });

  it('should unsaved changes', () => {
    expect(service.getUnsavedChanges()).toBeFalse();
    service.setUnsavedChanges(true);
    expect(service.getUnsavedChanges()).toBeTrue();
    service.setUnsavedChanges(false);
    expect(service.getUnsavedChanges()).toBeFalse();
  });

  it('should auto save', () => {
    expect(service.getAutoSaveEnabled()).toBeTrue();
    service.setAutoSaveEnabled(false);
    expect(service.getAutoSaveEnabled()).toBeFalse();
    service.setAutoSaveEnabled(true);
    expect(service.getAutoSaveEnabled()).toBeTrue();
  });

  it('should get next page id', () => {
    // construct model
    service.model = {
      pages: [
        {
          name: 'p1'
        }, {
          name: 'p3'
        }
      ]
    };

    expect(service.newPageID()).toEqual('p2');
  });

  it('should get next element id', () => {
    // construct model
    service.model = {
      pages: [
        {
          elements: [
            {name: 'e1'},
            {name: 'e2'}
          ]
        }, {
          elements: [
            {name: 'e3'},
            {name: 'e5'},
          ]
        }
      ]
    };

    expect(service.newElementID()).toEqual('e4');
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
