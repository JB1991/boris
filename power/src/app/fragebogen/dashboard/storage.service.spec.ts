import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';
import { environment } from '@env/environment';

describe('Fragebogen.Dashboard.StorageService', () => {
  let service: StorageService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formId = 'brf2hhsdev046mhfpio0';
  const formsUrl = environment.formAPI + 'forms';
  const formsUrlWithId = environment.formAPI + 'forms/' + formId;

  const formSample = require('../../../assets/fragebogen/form-sample.json');
  const formsListSample = require('../../../assets/fragebogen/forms-list.json');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    // Inject the service, http client and test controller for each test
    service = TestBed.inject(StorageService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Check that the service is defined including the forms list
    expect(service).toBeDefined();
    expect(service.formsList.length).toBe(0);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadFormsList() should load a list of forms', () => {
    service.loadFormsList().subscribe(data => expect(data).toEqual(formsListSample));
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
  });

  it('loadFormById() should load a form by id', () => {
    service.loadForm(formId).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(formsUrlWithId, 'GET', formSample);
  });

  it('createForm() should upload a form from JSON', () => {
    service.createForm(formSample).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(formsUrl, 'POST', formSample);
  });

  it('deleteForm() should delete a form by id', () => {
    // TODO Change null to real response
    service.deleteForm(formId).subscribe(data => expect(data).toEqual(null));
    answerHTTPRequest(formsUrlWithId, 'DELETE', null);
  });

  it('resetService() should reset service to empty model', () => {
    service.formsList = formsListSample;
    expect(service.formsList).toEqual(formsListSample);
    service.resetService();
    expect(service.formsList).toEqual([]);
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
    request.flush(body, opts);
  }

  afterEach(() => {
    // Verify that no requests are remaining
    httpTestingController.verify();
  });
});
