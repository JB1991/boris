import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { NewformComponent } from './newform.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { environment } from '@env/environment';
import { Component } from '@angular/core';

describe('Fragebogen.Dashboard.Newform.NewformComponent', () => {
  let component: NewformComponent;
  let fixture: ComponentFixture<NewformComponent>;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../../assets/fragebogen/form-sample.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'forms/details/:id', component: MockDetailsComponent}
        ])
      ],
      providers: [
        BsModalService,
        StorageService,
        AlertsService
      ],
      declarations: [
        NewformComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
    spyOn(component.alerts, 'NewAlert');
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close', () => {
    component.open();
    expect(component.modal.isShown).toBeTrue();
    component.close();
    expect(component.modal.isShown).toBeFalse();
  });

  it('should new form', () => {
    component.title = 'Test';
    fixture.detectChanges();
    component.NewForm();

    answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST', formSample);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Erfolgreich erstellt', 'Das Formular wurde erfolgreich erstellt.');
  });

  it('should new form template', () => {
    component.title = 'Test';
    component.template = '123';
    fixture.detectChanges();
    component.NewForm();

    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
    answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST', formSample);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Erfolgreich erstellt', 'Das Formular wurde erfolgreich erstellt.');
  });

  it('should fail new form template', () => {
    component.title = 'Test';
    component.template = '123';
    fixture.detectChanges();

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', null);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '123');

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
    answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST', null);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', '');
  });

  it('should fail new form template', () => {
    component.title = 'Test';
    component.template = '123';
    fixture.detectChanges();

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET',
                      { 'error': 'Internal Server Error'});
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
    answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST',
                      { 'error': 'Internal Server Error'});
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
    expect(component.alerts.NewAlert)
    .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Internal Server Error');
  });

  it('should fail new form template 404', () => {
    component.title = 'Test';
    component.template = '123';
    fixture.detectChanges();

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample,
                      { status: 404, statusText: 'Not Found' });
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');

    component.NewForm();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
    answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST', formSample,
                      { status: 404, statusText: 'Not Found' });
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Not Found');
  });

  it('should crash make form', () => {
    expect(function () {
      component.makeForm(null);
    }).toThrowError('template is required');

    expect(function () {
      component.makeForm({'x': 5});
    }).toThrowError('title is required');
  });

  it('should fail new form', () => {
    component.NewForm();
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert)
    .toHaveBeenCalledWith('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
  });

  it('should add tag', () => {
    component.tagInput = 'MyTag';
    component.addTag();
    expect(component.tagList.length).toEqual(1);
    expect(component.tagList[0]).toEqual('MyTag');

    component.removeTag(0);
    expect(component.tagList.length).toEqual(0);
  });

  it('should fail tag', () => {
    component.tagInput = '';
    component.addTag();
    expect(component.tagList.length).toEqual(0);

    component.tagInput = 'MyTag';
    component.addTag();
    expect(function () {
      component.removeTag(-1);
    }).toThrowError('Invalid i');
    expect(function () {
      component.removeTag(1);
    }).toThrowError('Invalid i');
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

@Component({
  selector: 'power-formulars-details',
  template: ''
})
class MockDetailsComponent {
}
