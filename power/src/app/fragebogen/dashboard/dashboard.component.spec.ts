import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { environment } from '@env/environment';
import { DashboardComponent } from './dashboard.component';
import { StorageService } from '@app/fragebogen/dashboard/storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

// TODO Replace StorageService with a test double? (stub, fake, spy or mock)
describe('Fragebogen.Dashboard.DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let storage: StorageService;
  let alerts: jasmine.SpyObj<AlertsService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formId: String = 'bs63c2os5bcus8t5q0kg';
  const formsUrl: String = environment.formAPI + 'intern/forms?fields=access,access-minutes,created,id,owners,readers,status,tags,title';
  const tagsUrl: String = environment.formAPI + 'intern/tags';
  const formsUrlWithId: String = environment.formAPI + 'intern/forms/' + formId;

  const formSample = require('../../../assets/fragebogen/form-sample.json');
  const formsListSample = require('../../../assets/fragebogen/forms-list-sample.json');
  const tagsSample = require('../../../assets/fragebogen/tags-sample.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        StorageService,
        {provide: AlertsService, useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])}
      ],
      declarations: [
        DashboardComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storage = TestBed.inject(StorageService);
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    expect(component).toBeDefined();
    expect(storage.formsList.length).toBe(0);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(0);
  }));

  it('ngOnInit() should fail if no response for forms is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', null);
    expect(storage.formsList.length).toBe(0);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '');
  });

  it('ngOnInit() should fail if no response for tags is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', null);
    expect(storage.tagList.length).toBe(0);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '');
  });

  it('ngOnInit() should get a list of forms by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(0);
  });

  // it('ngOnInit() should fail if a 404 is returned by the API for forms', () => {
  //   answerHTTPRequest(formsUrl, 'GET', '', {status: 404, statusText: 'Not found'});
  //   expect(storage.formsList.length).toBe(0);
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  //   expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not found');
  // });

  // it('ngOnInit() should fail if a 404 is returned by the API for tags', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', '', {status: 404, statusText: 'Not found'});
  //   expect(storage.tagList.length).toBe(0);
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  //   expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not found');
  // });

  it('exportForm() should download the form returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);

    // Create spy object with methods click() and setAttribute() and spy on document.createElement()
    const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
    spyOn(document, 'createElement').and.returnValue(spyObj);

    component.exportForm(0);
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

    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(0);
  });

  it('exportForm() should fail if no response is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    component.exportForm(0);
    answerHTTPRequest(formsUrlWithId, 'GET', null);
    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  });

  it('exportForm() should fail if an error is returned by the API', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    component.exportForm(0);
    answerHTTPRequest(formsUrlWithId, 'GET', {'error': 'not found'});
    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  });

  // it('exportForm() should fail if a 404 is returned by the API', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.exportForm(0);
  //   answerHTTPRequest(formsUrlWithId, 'GET', '', {status: 404, statusText: 'Not found'});
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  // });

  it('importForm() should allow uploading a file', () => {
    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);

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

    // Overwrite native target property and trigger event directly
    Object.defineProperty(event, 'target', {value: {files: {0: file}}});
    const input = document.querySelector('#file-upload');
    input.dispatchEvent(event);

    expect(mockReader.readAsText).toHaveBeenCalledTimes(1);
    expect(storage.formsList.length).toBe(1);
  });

  // it('uploadForm() should upload a form to the API', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.uploadForm(formSample);
  //   answerHTTPRequest(formsUrl, 'POST', formSample);
  //   expect(storage.formsList.length).toBe(2);
  // });

  // it('uploadForm() should fail if no response is returned by the API', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.uploadForm(formSample);
  //   answerHTTPRequest(formsUrl, 'POST', null);
  //
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  //   expect(storage.formsList.length).toBe(1);
  // });

  // it('uploadForm() should fail if an error is returned by the API', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.uploadForm(formSample);
  //   answerHTTPRequest(formsUrl, 'POST', {'error': 'not found'});
  //
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  //   expect(storage.formsList.length).toBe(1);
  // });

  // it('uploadForm() should fail if a 404 is returned by the API', () => {
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.uploadForm(formSample);
  //   answerHTTPRequest(formsUrl, 'POST', '', {status: 404, statusText: 'Not found'});
  //
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  //   expect(storage.formsList.length).toBe(1);
  // });

  it('deleteForm() should delete a form', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);

    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    component.deleteForm(0);
    answerHTTPRequest(formsUrlWithId, 'DELETE', {'data': null});
    expect(storage.formsList.length).toBe(0);
  });

  // it('deleteForm() should fail if a 404 is returned by the API', () => {
  //   // Stub out confirm dialog
  //   spyOn(window, 'confirm').and.returnValue(true);
  //
  //   answerHTTPRequest(formsUrl, 'GET', formsListSample);
  //   answerHTTPRequest(tagsUrl, 'GET', tagsSample);
  //   component.deleteForm(0);
  //   answerHTTPRequest(formsUrlWithId, 'DELETE', '', {status: 404, statusText: 'Not found'});
  //
  //   expect(storage.formsList.length).toBe(1);
  //   expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  // });

  it('deleteForm() should fail if no response is returned by the API', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);

    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    component.deleteForm(0);
    answerHTTPRequest(formsUrlWithId, 'DELETE', null);

    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
  });

  it('deleteForm() should not delete a form if the user does not agree to the deletion', () => {
    // Stub out confirm dialog
    spyOn(window, 'confirm').and.returnValue(false);

    answerHTTPRequest(formsUrl, 'GET', formsListSample);
    answerHTTPRequest(tagsUrl, 'GET', tagsSample);
    component.deleteForm(0);

    expect(storage.formsList.length).toBe(1);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(0);
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
    storage.resetService();
    storage = null;

    // Verify that no requests are remaining
    httpTestingController.verify();

    // Destruction
    fixture.destroy();
    component = null;
  });
});
