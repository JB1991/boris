import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { environment } from '@env/environment';

import { DetailsComponent } from './details.component';
import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

describe('Fragebogen.Details.DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let httpTestingController: HttpTestingController;

    const formSample = require('../../../assets/fragebogen/form-sample.json');
    const formSample2 = require('../../../assets/fragebogen/form-sample-2.json');
    const deleteSample = require('../../../assets/fragebogen/form-deleted.json');
    const taskSample = require('../../../assets/fragebogen/tasks-list.json');
    const emptyResponse = require('../../../assets/fragebogen/empty-response.json');

    const formURL = environment.formAPI + 'intern/forms/1234';
    const tasksURL = environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks?limit=9007199254740991&offset=0&sort=created&order=desc';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms/dashboard', component: MockDashboardComponent }
                ])
            ],
            providers: [
                Title,
                StorageService,
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
                AlertsService,
                LoadingscreenService
            ],
            declarations: [
                DetailsComponent,
                MockMaketaskComponent,
                MockPublishComponent,
                MockCommentComponent,
                MockSettingsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        answerInitialRequests();
        expect(component.storage.tasksList.length).toEqual(2);
    });

    it('should create 2', () => {
        answerHTTPRequest(formURL, 'GET', formSample2);
        expect(component.storage.form.status).toEqual('created');
        expect(component.storage.tasksList).toEqual([]);
    });

    it('should create 3', () => {
        answerHTTPRequest(formURL, 'GET', formSample2);
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(null);
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should not create', () => {
        answerHTTPRequest(formURL, 'GET', null);
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '1234');
    });

    it('should not create 2', () => {
        answerHTTPRequest(formURL, 'GET', formSample);
        answerHTTPRequest(tasksURL, 'GET', null);
        expect(component.storage.tasksList).toEqual([]);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'bs63c2os5bcus8t5q0kg');
    });

    it('should error', () => {
        answerHTTPRequest(formURL, 'GET', { 'error': 'Internal Server Error' });
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 2', () => {
        answerHTTPRequest(formURL, 'GET', formSample);
        answerHTTPRequest(tasksURL, 'GET', { 'error': 'Internal Server Error' });
        expect(component.storage.tasksList).toEqual([]);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 404', () => {
        answerHTTPRequest(formURL, 'GET', formSample, { status: 404, statusText: 'Not Found' });
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should error 404 2', () => {
        answerHTTPRequest(formURL, 'GET', formSample);
        answerHTTPRequest(tasksURL, 'GET', taskSample, { status: 404, statusText: 'Not Found' });
        expect(component.storage.tasksList).toEqual([]);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should crash', () => {
        answerInitialRequests();
        expect(function () {
            component.loadData(null);
        }).toThrowError('id is required');
    });

    it('should delete form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
            'Das Formular wurde erfolgreich gelöscht.');
    });

    it('should not delete form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail delete form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'bs63c2os5bcus8t5q0kg');
    });

    it('should fail delete form 2', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE',
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Internal Server Error');
    });

    it('should delete form 404', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg', 'DELETE', deleteSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Not Found');
    });

    it('should archive form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.archiveForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg?cancel=true', 'POST', formSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('success', 'Formular archiviert', 'Das Formular wurde erfolgreich archiviert.');
    });

    it('should not archive form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(false);
        component.archiveForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail archive form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.archiveForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg?cancel=true', 'POST', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Archivieren fehlgeschlagen', 'bs63c2os5bcus8t5q0kg');
    });

    it('should fail archive form', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.archiveForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg?cancel=true', 'POST',
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Archivieren fehlgeschlagen', 'Internal Server Error');
    });

    it('should archive form 404', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        component.archiveForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg?cancel=true', 'POST', formSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Archivieren fehlgeschlagen', 'Not Found');
    });

    it('should get csv', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        navigator.msSaveBlob = null;
        const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
        spyOn(document, 'createElement').and.returnValue(spyObj);

        component.getCSV();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks/csv?status=submitted',
            'GET', '666');
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should get csv 2', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);
        navigator.msSaveBlob = () => true;
        const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
        spyOn(document, 'createElement').and.returnValue(spyObj);

        component.getCSV();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks/csv?status=submitted',
            'GET', '666');
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail get csv', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.getCSV();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks/csv?status=submitted',
            'GET', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Download fehlgeschlagen', 'Die Antworten konnten nicht geladen werden.');
    });

    it('should get csv 404', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.getCSV();
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks/csv?status=submitted',
            'GET', '666',
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Download fehlgeschlagen', 'Not Found');
    });

    it('should delete task', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        answerHTTPRequest(environment.formAPI + 'intern/tasks/bs8t7ifp9r1b3pt5qkr0', 'DELETE', deleteSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Antwort gelöscht',
            'Die Antwort wurde erfolgreich gelöscht.');
    });

    it('should not delete task', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(false);

        component.deleteTask(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail delete task', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        answerHTTPRequest(environment.formAPI + 'intern/tasks/bs8t7ifp9r1b3pt5qkr0', 'DELETE', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'bs8t7ifp9r1b3pt5qkr0');
    });

    it('should fail delete task', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        answerHTTPRequest(environment.formAPI + 'intern/tasks/bs8t7ifp9r1b3pt5qkr0', 'DELETE',
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Internal Server Error');
    });

    it('should delete task 404', () => {
        answerInitialRequests();
        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        answerHTTPRequest(environment.formAPI + 'intern/tasks/bs8t7ifp9r1b3pt5qkr0', 'DELETE', deleteSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Not Found');
    });

    it('should delete task crash', () => {
        answerInitialRequests();

        expect(function () {
            component.deleteTask(-1);
        }).toThrowError('invalid i');
        expect(function () {
            component.deleteTask(2);
        }).toThrowError('invalid i');
    });

    it('should open task', () => {
        answerInitialRequests();

        expect(function () {
            component.openTask(0);
        }).toThrowError('Cannot read property \'open\' of undefined');
    });

    it('should open task crash', () => {
        answerInitialRequests();

        expect(function () {
            component.openTask(-1);
        }).toThrowError('invalid i');
        expect(function () {
            component.openTask(2);
        }).toThrowError('invalid i');
    });

    it('should change tasks page', () => {
        answerInitialRequests();
        const event: PageChangedEvent = { page: 2, itemsPerPage: 5 };
        component.tasksPageChanged(event);
        answerHTTPRequest(environment.formAPI + 'intern/forms/bs63c2os5bcus8t5q0kg/tasks?limit=5&offset=5&sort=created&order=desc',
            'GET', emptyResponse);
        expect(component.storage.tasksList.length).toEqual(0);
        expect(component.storage.tasksCountTotal).toEqual(2);
    });

    function answerInitialRequests() {
        answerHTTPRequest(formURL, 'GET', formSample);
        answerHTTPRequest(tasksURL, 'GET', taskSample);
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
    selector: 'power-forms-details-comment',
    template: ''
})
class MockCommentComponent { }
@Component({
    selector: 'power-forms-details-maketask',
    template: ''
})
class MockMaketaskComponent { }
@Component({
    selector: 'power-forms-details-publish',
    template: ''
})
class MockPublishComponent { }
@Component({
    selector: 'power-forms-details-settings',
    template: ''
})
class MockSettingsComponent { }
@Component({
    selector: 'power-forms-dashboard',
    template: ''
})
class MockDashboardComponent { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
