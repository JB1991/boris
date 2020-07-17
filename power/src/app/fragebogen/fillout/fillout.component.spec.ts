import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { FilloutComponent } from './fillout.component';
import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { environment } from '@env/environment';

describe('Fragebogen.Fillout.FilloutComponent', () => {
  let component: FilloutComponent;
  let fixture: ComponentFixture<FilloutComponent>;
  let storage: StorageService;
  let alerts: jasmine.SpyObj<AlertsService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const accessSample = require('../../../assets/fragebogen/access.json');
  const formSample = require('../../../assets/fragebogen/form-sample.json');
  const submitSample = require('../../../assets/fragebogen/form-submit.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {
                  return '1234';
                }
              }
            }
          }
        },
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        },
        StorageService
      ],
      declarations: [
        FilloutComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storage = TestBed.inject(StorageService);
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    expect(storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
    expect(storage.form.id).toEqual('bs63c2os5bcus8t5q0kg');
  });

  it('should not create', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', null);
    expect(storage.task).toBeNull();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '1234 - null');
  });

  it('should not create 2', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', null);
    expect(storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
    expect(storage.form).toBeNull();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'bs7v95fp9r1ctg9cbecg');
  });

  it('should error 404', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample,
                      { status: 404, statusText: 'Not Found' });
    expect(storage.task).toBeNull();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
  });

  it('should error 404 2', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample,
                      { status: 404, statusText: 'Not Found' });
    expect(storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
    expect(storage.form).toBeNull();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
  });

  it('should submit progress', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.progress(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', submitSample);
    expect(storage.getUnsavedChanges()).toBeFalse();
  });

  it('should fail submit progress', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.progress(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', null);
    expect(storage.getUnsavedChanges()).toBeTrue();
  });

  it('should error 404 3', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.progress(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', submitSample,
                      { status: 404, statusText: 'Not Found' });
    expect(storage.getUnsavedChanges()).toBeTrue();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
  });

  it('should submit form', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.submit(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', submitSample);
    expect(storage.getUnsavedChanges()).toBeFalse();
  });

  it('should fail submit form', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.submit(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', null);
    expect(storage.getUnsavedChanges()).toBeTrue();
  });

  it('should error 404 4', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
    storage.setUnsavedChanges(true);

    component.submit(submitSample);
    answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', submitSample,
                      { status: 404, statusText: 'Not Found' });
    expect(storage.getUnsavedChanges()).toBeTrue();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
  });

  it('should set unsavedchanges', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);

    expect(storage.getUnsavedChanges()).toBeFalse();
    component.changed('data');
    expect(storage.getUnsavedChanges()).toBeTrue();
  });

  it('should throw error', () => {
    answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
    answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);

    expect(function () {
      component.loadData('');
    }).toThrowError('pin is required');
    expect(function () {
      component.submit('');
    }).toThrowError('no data provided');
    expect(function () {
      component.progress(null);
    }).toThrowError('no data provided');
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
