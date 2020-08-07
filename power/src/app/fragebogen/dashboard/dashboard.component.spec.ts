import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { DashboardComponent } from './dashboard.component';
import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

describe('Fragebogen.Dashboard.DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formsListSample = require('../../../assets/fragebogen/forms-list-sample.json');
  const tagsSample = require('../../../assets/fragebogen/tags-sample.json');
  const deleteSample = require('../../../assets/fragebogen/form-deleted.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'forms', component: MockHomeComponent}
        ])
      ],
      providers: [
        Title,
        StorageService,
        AlertsService,
        LoadingscreenService
      ],
      declarations: [
        DashboardComponent,
        MockNewformComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
    spyOn(component.alerts, 'NewAlert');
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    expect(component.storage.formsList.length).toEqual(1);
    expect(component.storage.tagList.length).toEqual(3);
  });

  it('should not create', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', null);
    expect(component.storage.formsList.length).toEqual(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Tags');
  });

  it('should not create 2', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', null);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Forms');
  });

  it('should error', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', { 'error': 'Internal Server Error'});
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
  });

  it('should error 404', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample,
                      { status: 404, statusText: 'Not Found' });
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
  });

  it('should error 2', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET',
                      { 'error': 'Internal Server Error'});
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
  });

  it('should error 404 2', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample,
                      { status: 404, statusText: 'Not Found' });
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
  });

  it('should delete', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteForm(0);
    answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
                                                 'Das Formular wurde erfolgreich gelöscht.');
    expect(component.storage.formsList.length).toEqual(0);
  });

  it('should not delete', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteForm(0);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    expect(component.storage.formsList.length).toEqual(1);
  });

  it('should fail delete', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteForm(0);
    answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', null);
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'bs63c2os5bcus8t5q0kg');
    expect(component.storage.formsList.length).toEqual(1);
  });

  it('should fail delete', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteForm(0);
    answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE',
                      { 'error': 'Internal Server Error'});
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Internal Server Error');
    expect(component.storage.formsList.length).toEqual(1);
  });

  it('should fail delete 404', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteForm(0);
    answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample,
                      { status: 404, statusText: 'Not Found' });
    expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Not Found');
    expect(component.storage.formsList.length).toEqual(1);
  });

  it('should crash delete', () => {
    answerHTTPRequest(environment.formAPI +
                      'intern/forms?fields=created,id,owners,status,tags,title',
                      'GET', formsListSample);
    answerHTTPRequest(environment.formAPI + 'intern/tags', 'GET', tagsSample);
    spyOn(window, 'confirm').and.returnValue(true);

    expect(function () {
      component.deleteForm(1);
    }).toThrowError('Invalid id');
    expect(component.storage.formsList.length).toEqual(1);
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
  selector: 'power-formulars-dashboard-newform',
  template: ''
})
class MockNewformComponent {
}
@Component({
  selector: 'power-formulars-dashboard',
  template: ''
})
class MockHomeComponent {
}
