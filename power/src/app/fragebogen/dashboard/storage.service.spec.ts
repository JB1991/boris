import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageService } from './storage.service';
import { environment } from '@env/environment';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Dashboard.StorageService', () => {
  let service: StorageService;
  let httpTestingController: HttpTestingController;

  const formId = 'bs63c2os5bcus8t5q0kg';
  const formsURL = environment.formAPI + 'intern/forms?fields=created,id,owners,status,tags,title&sort=cancelled,published,created';

  const formContent = require('../../../assets/fragebogen/form-content.json');
  const formDeleted = require('../../../assets/fragebogen/form-deleted.json');
  const formSample = require('../../../assets/fragebogen/form-sample.json');
  const formsListSample = require('../../../assets/fragebogen/forms-list-sample.json');
  const tagsSample = require('../../../assets/fragebogen/tags-sample.json');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthService
      ]
    });
    spyOn(console, 'log');
    service = TestBed.inject(StorageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('loadFormsList() should load a list of forms', () => {
    service.loadFormsList().subscribe(data => expect(data).toEqual(formsListSample));
    answerHTTPRequest(formsURL, 'GET', formsListSample);
  });

  it('loadForm() should load a form by id', () => {
    service.loadForm(formId).subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'intern/forms/' + formId, 'GET', formSample);
  });

  it('loadTags() should load the tags', () => {
    service.loadTags().subscribe(data => expect(data).toEqual(tagsSample));
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
  });

  it('createForm() should upload a form from JSON', () => {
    service.createForm(formContent, 'xxx').subscribe(data => expect(data).toEqual(formSample));
    answerHTTPRequest(environment.formAPI + 'intern/forms?tags=xxx', 'POST', formSample);
  });

  it('deleteForm() should delete a form by id', () => {
    service.deleteForm(formId).subscribe(data => expect(data).toEqual(formDeleted));
    answerHTTPRequest(environment.formAPI + 'intern/forms/' + formId, 'DELETE', formDeleted);
  });

  it('should fail', () => {
    expect(function () {
      service.loadForm('');
    }).toThrowError('id is required');
    expect(function () {
      service.createForm('');
    }).toThrowError('data is required');
    expect(function () {
      service.deleteForm('');
    }).toThrowError('id is required');
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
