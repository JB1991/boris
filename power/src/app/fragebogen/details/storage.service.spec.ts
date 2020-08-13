import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Details.StorageService', () => {
    let service: StorageService;
    let httpTestingController: HttpTestingController;

    const formSample = require('../../../assets/fragebogen/form-sample.json');
    const deleteSample = require('../../../assets/fragebogen/form-deleted.json');
    const taskList = require('../../../assets/fragebogen/tasks-list.json');
    const taskSample = require('../../../assets/fragebogen/task-sample.json');

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

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.form).toBeNull();
        expect(service.tasksList.length).toEqual(0);
    });

    it('should load form', () => {
        service.loadForm('123').subscribe(data => expect(data).toEqual(formSample));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
    });

    it('should fail load form', () => {
        expect(function () {
            service.loadForm('');
        }).toThrowError('id is required');

        expect(function () {
            service.loadForm(null);
        }).toThrowError('id is required');
    });

    it('should publish form', () => {
        service.publishForm('123').subscribe(data => expect(data).toEqual(formSample));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123?publish=true&access=pin6&access-minutes=60',
            'POST', formSample);
    });

    it('should fail publish form', () => {
        expect(function () {
            service.publishForm('');
        }).toThrowError('id is required');

        expect(function () {
            service.publishForm('123', 'pin5');
        }).toThrowError('pin is invalid');
    });

    it('should archive form', () => {
        service.archiveForm('123').subscribe(data => expect(data).toEqual(formSample));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123?cancel=true', 'POST', formSample);
    });

    it('should fail archive form', () => {
        expect(function () {
            service.archiveForm(null);
        }).toThrowError('id is required');
    });

    it('should delete form', () => {
        service.deleteForm('123').subscribe(data => expect(data).toEqual(deleteSample));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'DELETE', deleteSample);
    });

    it('should fail delete form', () => {
        expect(function () {
            service.deleteForm('');
        }).toThrowError('id is required');
    });

    it('should load tasks', () => {
        service.loadTasks('123').subscribe(data => expect(data).toEqual(taskList));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?sort=submitted,created', 'GET', taskList);
    });

    it('should fail load tasks', () => {
        expect(function () {
            service.loadTasks('');
        }).toThrowError('id is required');
    });

    it('should create tasks', () => {
        service.createTask('123', 2, '123456').subscribe(data => expect(data).toEqual(taskList));
        answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=2&factor=123456', 'POST', taskList);
    });

    it('should fail create tasks', () => {
        expect(function () {
            service.createTask('');
        }).toThrowError('id is required');
    });

    it('should update task comment', () => {
        service.updateTaskComment('123', 'Test').subscribe(data => expect(data).toEqual(taskSample));
        answerHTTPRequest(environment.formAPI + 'intern/tasks/123?description=Test', 'POST', taskSample);
    });

    it('should fail update task comment', () => {
        expect(function () {
            service.updateTaskComment('', '');
        }).toThrowError('id is required');
    });

    it('should delete task', () => {
        service.deleteTask('1234').subscribe(data => expect(data).toEqual(deleteSample));
        answerHTTPRequest(environment.formAPI + 'intern/tasks/1234', 'DELETE', deleteSample);
    });

    it('should fail delete task', () => {
        expect(function () {
            service.deleteTask('');
        }).toThrowError('id is required');
    });

    it('should get csv', () => {
        service.getCSV('1234').subscribe(data => expect(data).toEqual('666'));
        answerHTTPRequest(environment.formAPI + 'intern/forms/1234/tasks/csv?status=submitted', 'GET', '666');
    });

    it('should fail get csv', () => {
        expect(function () {
            service.getCSV(null);
        }).toThrowError('id is required');
    });

    it('should reset service', () => {
        service.form = { 'a': 1 };
        service.tasksList = [2, 5];
        service.resetService();
        expect(service.form).toBeNull();
        expect(service.tasksList.length).toEqual(0);
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
/* vim: set expandtab ts=4 sw=4 sts=4: */
