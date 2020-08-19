import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
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
    const taskList = require('../../../assets/fragebogen/tasks-list.json');
    const emptyResponse = require('../../../assets/fragebogen/empty-response.json');

    const formsURL = environment.formAPI
        + 'intern/forms?fields=created,id,owners,status,tags,title&limit=9007199254740991&offset=0&sort=title';
    const tasksURL = environment.formAPI + 'intern/tasks?status=submitted&sort=submitted&limit=9007199254740991&offset=0';
    const tagsURL = environment.formAPI + 'intern/tags';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ]),
                PaginationModule.forRoot()
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
        answerInitialRequests();
        checkStorageVariables(1, 2, 3, 1, 2);
    });

    it('should not create', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', taskList);
        answerHTTPRequest(tagsURL, 'GET', null);
        checkStorageVariables(1, 2, 0, 1, 2);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Tags');
    });

    it('should not create 2', () => {
        answerHTTPRequest(formsURL, 'GET', null);
        checkStorageVariables(0, 0, 0, 0, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Forms');
    });

    it('should not create 3', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', null);
        answerHTTPRequest(tagsURL, 'GET', tagsSample);
        checkStorageVariables(1, 0, 3, 1, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Tasks');
    });

    it('should error', () => {
        answerHTTPRequest(formsURL, 'GET', { 'error': 'Internal Server Error' });
        checkStorageVariables(0, 0, 0, 0, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 404', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample, { status: 404, statusText: 'Not Found' });
        checkStorageVariables(0, 0, 0, 0, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should error 2', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', taskList);
        answerHTTPRequest(tagsURL, 'GET', { 'error': 'Internal Server Error' });
        checkStorageVariables(1, 2, 0, 1, 2);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 3', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', { 'error': 'Internal Server Error' });
        answerHTTPRequest(tagsURL, 'GET', tagsSample);
        checkStorageVariables(1, 0, 3, 1, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 404 2', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', taskList);
        answerHTTPRequest(tagsURL, 'GET', tagsSample, { status: 404, statusText: 'Not Found' });
        checkStorageVariables(1, 2, 0, 1, 2);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should error 404 3', () => {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', taskList,
            { status: 404, statusText: 'Not Found' });
        answerHTTPRequest(tagsURL, 'GET', tagsSample);
        checkStorageVariables(1, 0, 3, 1, 0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should delete', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm(0);
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
            'Das Formular wurde erfolgreich gelöscht.');
        expect(component.storage.formsList.length).toEqual(0);
    });

    it('should not delete', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteForm(0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
        expect(component.storage.formsList.length).toEqual(1);
    });

    it('should fail delete', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm(0);
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'bs63c2os5bcus8t5q0kg');
        expect(component.storage.formsList.length).toEqual(1);
    });

    it('should fail delete 2', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm(0);
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE',
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Internal Server Error');
        expect(component.storage.formsList.length).toEqual(1);
    });

    it('should fail delete 404', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm(0);
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Not Found');
        expect(component.storage.formsList.length).toEqual(1);
    });

    it('should crash delete', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        expect(function () {
            component.deleteForm(1);
        }).toThrowError('Invalid id');
        expect(component.storage.formsList.length).toEqual(1);
    });

    it('should change forms page', () => {
        answerInitialRequests();
        const event: PageChangedEvent = { page: 2, itemsPerPage: 5 };
        component.formsPageChanged(event);
        answerHTTPRequest(environment.formAPI +
            'intern/forms?fields=created,id,owners,status,tags,title&limit=5&offset=5&sort=title',
            'GET', emptyResponse);
        expect(component.storage.formsList.length).toEqual(0);
        expect(component.storage.formsCountTotal).toEqual(1);
    });

    it('should change tasks page', () => {
        answerInitialRequests();
        const event: PageChangedEvent = { page: 2, itemsPerPage: 5 };
        component.tasksPageChanged(event);
        answerHTTPRequest(environment.formAPI + 'intern/tasks?status=submitted&sort=submitted&limit=5&offset=5',
            'GET', emptyResponse);
        expect(component.storage.tasksList.length).toEqual(0);
        expect(component.storage.tasksCountTotal).toEqual(2);
    });

    function checkStorageVariables(formsListLength, tasksListLength, tagListLength, formsCountTotal, tasksCountTotal) {
        expect(component.storage.formsList.length).toEqual(formsListLength);
        expect(component.storage.tasksList.length).toEqual(tasksListLength);
        expect(component.storage.tagList.length).toEqual(tagListLength);
        expect(component.storage.formsCountTotal).toEqual(formsCountTotal);
        expect(component.storage.tasksCountTotal).toEqual(tasksCountTotal);
    }

    function answerInitialRequests() {
        answerHTTPRequest(formsURL, 'GET', formsListSample);
        answerHTTPRequest(tasksURL, 'GET', taskList);
        answerHTTPRequest(tagsURL, 'GET', tagsSample);
    }

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
    selector: 'power-forms-dashboard-newform',
    template: ''
})
class MockNewformComponent {
}
@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
