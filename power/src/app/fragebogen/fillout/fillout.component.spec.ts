import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { FilloutComponent } from './fillout.component';
import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

describe('Fragebogen.Fillout.FilloutComponent', () => {
    let component: FilloutComponent;
    let fixture: ComponentFixture<FilloutComponent>;
    let httpTestingController: HttpTestingController;

    const accessSample = require('../../../assets/fragebogen/public-get-access.json');
    const accessemptySample = require('../../../assets/fragebogen/public-get-access-empty.json');
    const formSample = require('../../../assets/fragebogen/intern-get-forms-id.json');
    const taskSample = require('../../../assets/fragebogen/intern-get-tasks-id.json');
    const submitSample = require('../../../assets/fragebogen/public-post-tasks.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
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
                FilloutComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FilloutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        expect(component.storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
        expect(component.storage.form.id).toEqual('bs63c2os5bcus8t5q0kg');
    });

    it('should create 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(null);
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should create public', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake(function (arg) {
            if (arg === 'id') {
                return 'bs8t7ifp9r1b3pt5qkr0';
            }
            return null;
        });
        component.ngOnInit();
        answerHTTPRequest(environment.formAPI + 'public/forms/bs8t7ifp9r1b3pt5qkr0', 'GET', formSample);
    });

    it('should create public 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake(function (arg) {
            if (arg === 'id') {
                return 'bs8t7ifp9r1b3pt5qkr0';
            }
            return null;
        });
        component.submitTask('bs8t7ifp9r1b3pt5qkr0', taskSample.data.content);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs8t7ifp9r1b3pt5qkr0/tasks?submit=true',
            'POST', taskSample);
    });

    it('should not create public 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake(function (arg) {
            if (arg === 'id') {
                return 'bs8t7ifp9r1b3pt5qkr0';
            }
            return null;
        });
        component.submitTask('bs8t7ifp9r1b3pt5qkr0', taskSample.data.content);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs8t7ifp9r1b3pt5qkr0/tasks?submit=true', 'POST', null);
    });

    it('should not create public 3', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake(function (arg) {
            if (arg === 'id') {
                return 'bs8t7ifp9r1b3pt5qkr0';
            }
            return null;
        });
        component.submitTask('bs8t7ifp9r1b3pt5qkr0',
            { result: taskSample.data.content, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/forms/bs8t7ifp9r1b3pt5qkr0/tasks?submit=true',
            'POST', { 'error': 'failed' });
    });

    it('should not create public 4', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake(function (arg) {
            if (arg === 'id') {
                return 'bs8t7ifp9r1b3pt5qkr0';
            }
            return null;
        });
        component.submitTask('bs8t7ifp9r1b3pt5qkr0',
            { result: taskSample.data.content, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/forms/bs8t7ifp9r1b3pt5qkr0/tasks?submit=true',
            'POST', {}, { status: 404, statusText: 'Not Found' });
    });

    it('should not create', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', null);
        expect(component.storage.task).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', '1234 - null');
    });

    it('should not create 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', null);
        expect(component.storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'bs7v95fp9r1ctg9cbecg');
    });

    it('should not create 3', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET',
            { 'error': 'Internal Server Error' });
        expect(component.storage.task).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');

        component.loadData('1234');
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET',
            { 'error': 'Internal Server Error' });
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 404', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.storage.task).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should error 404 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.storage.task.id).toEqual('bs834mvp9r1ctg9cbed0');
        expect(component.storage.form).toBeNull();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should submit progress', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessemptySample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.progress(submitSample);
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', submitSample);
        expect(component.storage.getUnsavedChanges()).toBeFalse();
    });

    it('should not submit progress', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessemptySample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.submitted = true;
        component.progress(submitSample);
    });

    it('should fail submit progress', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.progress(submitSample);
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', null);
        expect(component.storage.getUnsavedChanges()).toBeTrue();

        component.progress(submitSample);
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST',
            { 'error': 'Internal Server Error' });
        expect(component.storage.getUnsavedChanges()).toBeTrue();
    });

    it('should error 404 3', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.progress(submitSample);
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0', 'POST', submitSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.storage.getUnsavedChanges()).toBeTrue();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
    });

    it('should submit form', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.submit({ result: submitSample, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', submitSample);
        expect(component.storage.getUnsavedChanges()).toBeFalse();
    });

    it('should fail submit form', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.submit({ result: submitSample, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', null);
        expect(component.storage.getUnsavedChanges()).toBeTrue();

        component.submit({ result: submitSample, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST',
            { 'error': 'Internal Server Error' });
        expect(component.storage.getUnsavedChanges()).toBeTrue();
    });

    it('should error 404 4', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        component.storage.setUnsavedChanges(true);

        component.submit({ result: submitSample, options: { showDataSavingError: () => { } } });
        answerHTTPRequest(environment.formAPI + 'public/tasks/bs834mvp9r1ctg9cbed0?submit=true', 'POST', submitSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.storage.getUnsavedChanges()).toBeTrue();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
    });

    it('should set unsavedchanges', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);

        expect(component.storage.getUnsavedChanges()).toBeFalse();
        component.changed('data');
        expect(component.storage.getUnsavedChanges()).toBeTrue();
    });

    it('should throw error', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);

        expect(function () {
            component.loadData('', '123');
        }).toThrowError('pin is required');
        expect(function () {
            component.submitTask(null, {});
        }).toThrowError('id is required');
        expect(function () {
            component.submitTask('123', null);
        }).toThrowError('no data provided');
        expect(function () {
            component.submit('');
        }).toThrowError('no data provided');
        expect(function () {
            component.progress(null);
        }).toThrowError('no data provided');
    });

    it('should not leave page', () => {
        answerHTTPRequest(environment.formAPI + 'public/access?pin=1234', 'GET', accessSample);
        answerHTTPRequest(environment.formAPI + 'public/forms/bs7v95fp9r1ctg9cbecg', 'GET', formSample);
        expect(component.canDeactivate()).toBeTrue();
        spyOn(window, 'confirm').and.returnValue(true);

        environment.production = true;
        expect(component.canDeactivate()).toEqual(!component.storage.getUnsavedChanges());
        environment.production = false;
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
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
