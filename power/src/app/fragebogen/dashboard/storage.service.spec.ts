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
  const tagsUrl: String = environment.formAPI + 'tags';
  const formsUrlWithId = environment.formAPI + 'forms/' + formId;

  const formSample = require('../../../assets/fragebogen/form-sample.json');
  const formsListSample = require('../../../assets/fragebogen/forms-list-sample.json');
  const tagsSample = require('../../../assets/fragebogen/tags-sample.json');

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

  it('loadFormsList() should load a list of forms', () => {
    service.loadFormsList().subscribe(data => expect(data).toEqual(formsListSample));
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
  });

  it('loadForm() should load a form by id', () => {
    service.loadForm(formId).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(formsUrlWithId, 'GET', formSample);
  });

  it('loadTags() should load the tags', () => {
    service.loadTags().subscribe(data => expect(data).toEqual(tagsSample));
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  });

  it('createForm() should upload a form from JSON', () => {
    service.createForm(formSample).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(formsUrl, 'POST', formSample);
  });

  it('deleteForm() should delete a form by id', () => {
    service.deleteForm(formId).subscribe(data => expect(data).toEqual({}));
    answerHTTPRequest(formsUrlWithId, 'DELETE', {});
  });

  it('resetService() should reset service to empty model', () => {
    service.formsList = formsListSample;
    expect(service.formsList).toEqual(formsListSample);
    service.resetService();
    expect(service.formsList).toEqual([]);
    expect(service.tagList).toEqual([]);
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
