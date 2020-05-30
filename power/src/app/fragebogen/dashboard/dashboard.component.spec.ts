import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {By} from '@angular/platform-browser';

import {environment} from '@env/environment';
import {DashboardComponent} from './dashboard.component';

describe('Fragebogen.Dashboard.DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../assets/form-sample.json');
  const form = JSON.stringify(formSample);
  const formId = 'bqg0hvkdev01va6s70ug';
  const formsUrl = environment.formAPI + 'forms';
  const formsUrlWithId = environment.formAPI + 'forms/' + formId;
  const answer = {
    data: [{
      'id': 'bqg0hvkdev01va6s70ug',
      'title': 'Minimal',
      'tags': [''],
      'created': '2020-04-22T09:06:06.077198Z',
      'updated': '2020-04-22T09:10:16.562098Z'
    }]
  };

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
    //expect(component.formsList.length).toBe(0);
    //expect(component.error).toEqual('');
  });

  /*
  it('ngOnInit() should fail if no response is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', null);

    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Laden fehlgeschlagen (Keine Antwort)');
  });

  it('ngOnInit() should fail if no forms are returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', {Form: null, Error: 'not found'});

    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Laden fehlgeschlagen (Fehler)');
  });

  it('ngOnInit() should get a list of forms by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('ngOnInit() should fail if a 404 is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', '', {status: 404, statusText: 'Not found'});

    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('Not found');
  });

  it('exportForm() should download the form returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);

    // Create spy object with methods click() and setAttribute() and spy on document.createElement()
    const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
    spyOn(document, 'createElement').and.returnValue(spyObj);

    component.exportForm(formId);
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

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('exportForm() should fail if no response is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.exportForm(formId);
    answerHTTPRequest(formsUrlWithId, 'GET', null);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Export fehlgeschlagen (Keine Antwort)');
  });

  it('exportForm() should fail if an error is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.exportForm(formId);
    answerHTTPRequest(formsUrlWithId, 'GET', {Form: null, Error: 'not found'});

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Export fehlgeschlagen (Fehler)');
  });

  it('exportForm() should fail if a 404 is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.exportForm(formId);
    answerHTTPRequest(formsUrlWithId, 'GET', '', {status: 404, statusText: 'Not found'});

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Not found');
  });

  it('exportForm() should fail if null is passed as form id', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.exportForm(null);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Export: Invalid UUID');
  });

  it('exportForm() should fail if an invalid UUID is passed as form id', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.exportForm('foobar');

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Export: Invalid UUID');
  });

  it('importForm() should allow uploading a file', () => {
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

    expect(mockReader.readAsText).toHaveBeenCalledTimes(1);
    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('processPostRequest() should execute a POST request against the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest(form);
    answerHTTPRequest(formsUrl, 'POST', answer);
    answerHTTPRequest(formsUrl, 'GET', answer);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });

  it('processPostRequest() should fail if null is passed as body', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest(null);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid JSON file');
  });

  it('processPostRequest() should fail if invalid JSON is passed as body', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest('foobar');

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Invalid JSON file');
  });

  it('processPostRequest() should fail if no response is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest(form);
    answerHTTPRequest(formsUrl, 'POST', null);
    answerHTTPRequest(formsUrl, 'GET', answer);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Import fehlgeschlagen (Keine Antwort)');
  });

  it('processPostRequest() should fail if an error is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest(form);
    answerHTTPRequest(formsUrl, 'POST', {Form: null, Error: 'not found'});
    answerHTTPRequest(formsUrl, 'GET', answer);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Import fehlgeschlagen (Fehler)');
  });

  it('processPostRequest() should fail if a 404 is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.processPostRequest(form);
    answerHTTPRequest(formsUrl, 'POST', '', {status: 404, statusText: 'Not found'});

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Not found');
  });

  it('deleteForm() should delete a form', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);

    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm(formId);
    answerHTTPRequest(formsUrlWithId, 'DELETE', {'data': null});
    answerHTTPRequest(formsUrl, 'GET', {data: []});

    expect(component.formsList.length).toBe(0);
    expect(component.error).toBe('');
  });

  it('deleteForm() should fail if a 404 is returned by the API', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);

    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm(formId);
    answerHTTPRequest(formsUrlWithId, 'DELETE', '', {status: 404, statusText: 'Not found'});

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Not found');
  });

  it('deleteForm() should fail if null is passed as form id', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm(null);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Delete: Invalid UUID');
  });

  it('deleteForm() should fail if an invalid UUID is passed as form id', () => {
    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm('foobar');

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Delete: Invalid UUID');
  });

  it('deleteForm() should fail if no response is returned by the API', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);

    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm(formId);
    answerHTTPRequest(formsUrlWithId, 'DELETE', null);
    answerHTTPRequest(formsUrl, 'GET', answer);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('Löschen fehlgeschlagen (Keine Antwort)');
  });

  it('deleteForm() should not delete a form if the user does not agree to the deletion', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(false);

    answerHTTPRequest(formsUrl, 'GET', answer);
    component.deleteForm(formId);

    expect(component.formsList.length).toBe(1);
    expect(component.error).toBe('');
  });
  */

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

    // Destruction
    fixture.destroy();
    component = null;
  });
});
