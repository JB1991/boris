import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {By} from '@angular/platform-browser';

import {environment} from '@env/environment';
import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../assets/form-sample.json');
  const form = JSON.stringify(formSample);
  const formId = 'bqg0hvkdev01va6s70ug';
  const formsUrl = environment.fragebogen_api + 'forms';
  const formsUrlWithId = environment.fragebogen_api + 'forms/' + formId;
  const answer = {data: [{'id': 'bqg0hvkdev01va6s70ug', 'title': 'Minimal', 'tags': [''], 'created': '2020-04-22T09:06:06.077198Z', 'updated': '2020-04-22T09:10:16.562098Z'}]};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Check that the component is defined including the forms list and error status
    expect(component).toBeDefined();
    expect(component.formsList.length).toBe(0);
    expect(component.error).toEqual('');
  });

  it('ngOnInit() should fail if no response is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', null);

    // Check that no forms and an error is returned by the API
    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Could not load forms (no response)');
  });

  it('ngOnInit() should fail if no forms are returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', {Form: null, Error: 'not found'});

    // Check that no forms and an error is returned by the API
    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Could not load forms (error)');
  });

  it('ngOnInit() should get a list of forms by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Check that one form and no error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('ngOnInit() should fail if a 404 is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', '', {status: 404, statusText: 'Not found'});

    // Check that no forms and an error is returned by the API
    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Not found');
  });

  it('exportForm() should download the form returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Create spy object with methods click() and setAttribute()
    const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);

    // Spy on document.createElement() and return the spy object
    spyOn(document, 'createElement').and.returnValue(spyObj);

    // Call export form
    component.exportForm(formId);

    // Take GET request of exportForm() from queue and return the answer
    answerHTTPRequest(formsUrlWithId, 'GET', formSample);

    // Expect that the <a> tag was created
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');

    // Expect that setAttribute() was called twice
    expect(spyObj.setAttribute).toHaveBeenCalledTimes(2);
    expect(spyObj.setAttribute).toHaveBeenCalledWith('download', 'formular.json');

    // Expect that click() was called once without any arguments
    expect(spyObj.click).toHaveBeenCalledTimes(1);
    expect(spyObj.click).toHaveBeenCalledWith();

    // Check that one form and no error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('exportForm() should fail if no response is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call export form
    component.exportForm(formId);

    // Take GET request of exportForm() from queue and return the answer
    answerHTTPRequest(formsUrlWithId, 'GET', null);

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Could not export form (no response)');
  });

  it('exportForm() should fail if an error is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call export form
    component.exportForm(formId);

    // Take GET request of exportForm() from queue and return the answer
    answerHTTPRequest(formsUrlWithId, 'GET', {Form: null, Error: 'not found'});

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Could not export form (error)');
  });

  it('exportForm() should fail if a 404 is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call export form
    component.exportForm(formId);

    // Take GET request of exportForm() from queue and return the answer
    answerHTTPRequest(formsUrlWithId, 'GET', '', {status: 404, statusText: 'Not found'});

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Not found');
  });

  it('exportForm() should fail if null is passed as form id', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call export form
    component.exportForm(null);

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid UUID');
  });

  it('exportForm() should fail if an invalid UUID is passed as form id', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call export form
    component.exportForm('foobar');

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid UUID');
  });

  it('importForm() should allow uploading a file', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Check the import button
    const button = fixture.debugElement.query(By.css('#button-import'));
    expect(button).toBeDefined();
    expect(button.nativeElement.id).toEqual('button-import');
    expect(button.nativeElement.textContent).toContain('Import');

    // Spy on FileReader
    const mockReader = jasmine.createSpyObj('FileReader', ['readAsText']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    // Trigger event via event binding
    button.triggerEventHandler('click', null);

    // Create event
    const blob = new Blob([JSON.stringify(formSample)], {type: 'application/json'});
    const file = new File([blob], 'formular.json');
    const event = new Event('change', {bubbles: true});

    // Overwrite native target property
    Object.defineProperty(event, 'target', {value: {files: {0: file}}});

    // Trigger event directly
    const input = document.querySelector('#file-upload');
    input.dispatchEvent(event);

    // Expect that reader.readAsText() was called
    expect(mockReader.readAsText).toHaveBeenCalledTimes(1);

    // Check that one form and no error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('processPostRequest() should execute a POST request against the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest(form);

    // Take POST request from queue and return the answer
    answerHTTPRequest(formsUrl, 'POST', answer);

    // Take another GET request from queue and return the answer (for ngOnInit()-call)
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Check that one form and no error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('processPostRequest() should fail if null is passed as body', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest(null);

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid JSON file');
  });

  it('processPostRequest() should fail if invalid JSON is passed as body', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest('foobar');

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid JSON file');
  });

  it('processPostRequest() should fail if no response is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest(form);

    // Take POST request from queue and return the answer
    answerHTTPRequest(formsUrl, 'POST', null);

    // Take another GET request from queue and return the answer (for ngOnInit()-call)
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Could not import form (no response)');
  });

  it('processPostRequest() should fail if an error is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest(form);

    // Take POST request from queue and return the answer
    answerHTTPRequest(formsUrl, 'POST', {Form: null, Error: 'not found'});

    // Take another GET request from queue and return the answer (for ngOnInit()-call)
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Could not import form (error)');
  });

  it('processPostRequest() should fail if a 404 is returned by the API', () => {
    // Take GET request from queue and return the answer
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Call processPostRequest()
    component.processPostRequest(form);

    // Take POST request from queue and return the answer
    answerHTTPRequest(formsUrl, 'POST', '', {status: 404, statusText: 'Not found'});

    // Check that one form and an error is returned by the API
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Not found');
  });

  /**
   * Process HTTP requests
   * @param url The URL of the GET request
   * @param method HTTP request method
   * @param body The body of the answer
   * @param opts Optional HTTP information of the answer
   */
  function answerHTTPRequest(url, method, body, opts?) {
    // Take GET request from queue
    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toEqual(method);

    // Return the answer
    request.flush(body, opts);
  }

  afterEach(() => {
    // Verify that no requests are remaining
    httpTestingController.verify();

    // Destruction
    fixture.destroy();
    component = null;
  });
});
