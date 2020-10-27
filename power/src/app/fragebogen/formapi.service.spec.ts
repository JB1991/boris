import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { FormAPIService } from './formapi.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.FormAPIService', () => {
    let service: FormAPIService;
    let httpTestingController: HttpTestingController;

    const internForms = require('../../assets/fragebogen/intern-get-forms.json');
    const publicAccess = require('../../assets/fragebogen/public-get-access.json');

    const httpRequests = [
        { func: 'getInternTags', param1: null, param2: null, method: 'GET', url: 'intern/tags' },
        { func: 'getInternForms', param1: null, param2: null, method: 'GET', url: 'intern/forms' },
        { func: 'createInternForm', param1: {}, param2: null, method: 'POST', url: 'intern/forms' },
        { func: 'getInternForm', param1: '123', param2: null, method: 'GET', url: 'intern/forms/123' },
        { func: 'updateInternForm', param1: '123', param2: null, method: 'POST', url: 'intern/forms/123' },
        { func: 'deleteInternForm', param1: '123', param2: null, method: 'DELETE', url: 'intern/forms/123' },
        { func: 'getInternFormTasks', param1: '123', param2: null, method: 'GET', url: 'intern/forms/123/tasks' },
        { func: 'createInternFormTasks', param1: '123', param2: {}, method: 'POST', url: 'intern/forms/123/tasks' },
        { func: 'getInternTasks', param1: null, param2: null, method: 'GET', url: 'intern/tasks' },
        { func: 'getInternTask', param1: '123', param2: null, method: 'GET', url: 'intern/tasks/123' },
        { func: 'updateInternTask', param1: '123', param2: null, method: 'POST', url: 'intern/tasks/123' },
        { func: 'deleteInternTask', param1: '123', param2: null, method: 'DELETE', url: 'intern/tasks/123' },
        { func: 'getInternElements', param1: null, param2: null, method: 'GET', url: 'intern/elements' },
        { func: 'createInternElement', param1: {}, param2: null, method: 'POST', url: 'intern/elements' },
        { func: 'getInternElement', param1: '123', param2: null, method: 'GET', url: 'intern/elements/123' },
        { func: 'updateInternElement', param1: '123', param2: null, method: 'POST', url: 'intern/elements/123' },
        { func: 'deleteInternElement', param1: '123', param2: null, method: 'DELETE', url: 'intern/elements/123' },
        { func: 'getPublicForms', param1: null, param2: null, method: 'GET', url: 'public/forms' },
        { func: 'getPublicForm', param1: '123', param2: null, method: 'GET', url: 'public/forms/123' },
        { func: 'createPublicTask', param1: '123', param2: {}, method: 'POST', url: 'public/forms/123/tasks' },
        { func: 'getPublicTask', param1: '123', param2: null, method: 'GET', url: 'public/tasks/123' },
        { func: 'updatePublicTask', param1: '123', param2: null, method: 'POST', url: 'public/tasks/123' },
        { func: 'getPublicAccess', param1: 'abc', param2: null, method: 'GET', url: 'public/access?pin=abc' }
    ];
    const inputErrors = [
        { func: 'createInternForm', param1: '', param2: null, missing: 'form' },
        { func: 'getInternForm', param1: '', param2: null, missing: 'id' },
        { func: 'updateInternForm', param1: '', param2: null, missing: 'id' },
        { func: 'deleteInternForm', param1: '', param2: null, missing: 'id' },
        { func: 'getInternFormTasks', param1: '', param2: null, missing: 'id' },
        { func: 'createInternFormTasks', param1: '', param2: {}, missing: 'id' },
        { func: 'createInternFormTasks', param1: '123', param2: '', missing: 'results' },
        { func: 'getInternFormCSV', param1: '', param2: '', missing: 'id' },
        { func: 'getInternTask', param1: '', param2: null, missing: 'id' },
        { func: 'updateInternTask', param1: '', param2: null, missing: 'id' },
        { func: 'deleteInternTask', param1: '', param2: null, missing: 'id' },
        { func: 'createInternElement', param1: '', param2: null, missing: 'element' },
        { func: 'getInternElement', param1: '', param2: null, missing: 'id' },
        { func: 'updateInternElement', param1: '', param2: null, missing: 'id' },
        { func: 'deleteInternElement', param1: '', param2: null, missing: 'id' },
        { func: 'getPublicForm', param1: '', param2: null, missing: 'id' },
        { func: 'createPublicTask', param1: '', param2: {}, missing: 'id' },
        { func: 'createPublicTask', param1: '123', param2: '', missing: 'results' },
        { func: 'getPublicTask', param1: '', param2: null, missing: 'id' },
        { func: 'updatePublicTask', param1: '', param2: null, missing: 'id' },
        { func: 'getPublicAccess', param1: '', param2: null, missing: 'pin' }
    ];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                AuthService
            ]
        });
        service = TestBed.inject(FormAPIService);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOn(console, 'log');
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /*
        SUCCESS
    */
    // it('should get formlist with fields', (done) => {
    //     service.getInternForms({ fields: 'id,title', status: 'published' }).then((value) => {
    //         expect(value).toEqual(internForms);
    //         done();
    //     });
    //     answerHTTPRequest(environment.formAPI + 'intern/forms?fields=id%2Ctitle&status=published',
    //         'GET', internForms);
    // });

    // it('should get access with factor', (done) => {
    //     service.getPublicAccess('123', 'abc').then((value) => {
    //         expect(value).toEqual(publicAccess['data']);
    //         done();
    //     });
    //     answerHTTPRequest(environment.formAPI + 'public/access?pin=123&factor=abc',
    //         'GET', publicAccess);
    // });

    // it('should get getInternFormCSV with fields', (done) => {
    //     service.getInternFormCSV('123', { status: 'submitted' }).then((value) => {
    //         expect(value).toEqual('Toast');
    //         done();
    //     });
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks/csv?status=submitted', 'GET', 'Toast');
    // });

    /*
        EMPTY RESPONSE ERRORS
    */
    // httpRequests.forEach((test) => {
    //     it('should fail ' + test.func + ' with empty response', (done) => {
    //         service[test.func](test.param1, test.param2).catch((error) => {
    //             expect(error.toString()).toEqual('Error: API returned an empty response');
    //             done();
    //         });
    //         answerHTTPRequest(environment.formAPI + test.url, test.method, null);
    //     });
    // });

    // it('should fail getInternFormCSV with empty response', (done) => {
    //     service.getInternFormCSV('123').catch((error) => {
    //         expect(error.toString()).toEqual('Error: API returned an empty response');
    //         done();
    //     });
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks/csv', 'GET', null);
    // });

    /*
        ERROR RESPONSE
    */
    httpRequests.forEach((test) => {
        it('should fail ' + test.func + ' with error response', (done) => {
            service[test.func](test.param1, test.param2).catch((error) => {
                expect(error.toString()).toEqual('Error: API returned error: Toast');
                done();
            });
            answerHTTPRequest(environment.formAPI + test.url, test.method, { error: 'Toast' });
        });
    });

    /*
        EMPTY DATA ERRORS
    */
    httpRequests.forEach((test) => {
        it('should fail ' + test.func + ' with empty data', (done) => {
            service[test.func](test.param1, test.param2).catch((error) => {
                expect(error.toString()).toEqual('Error: API returned an invalid response');
                done();
            });
            answerHTTPRequest(environment.formAPI + test.url, test.method, {});
        });
    });

    /*
        HTTP ERRORS
    */
    httpRequests.forEach((test) => {
        it('should fail ' + test.func + ' with http error', (done) => {
            service[test.func](test.param1, test.param2).catch((error) => {
                expect(error.toString()).toEqual('Error: Http failure response for http://localhost:8080/' + test.url + ': 404 Not Found');
                done();
            });
            answerHTTPRequest(environment.formAPI + test.url, test.method, '',
                { status: 404, statusText: 'Not Found' });
        });
    });

    // it('should fail getInternFormCSV with http error', (done) => {
    //     service.getInternFormCSV('123').catch((error) => {
    //         expect(error.toString()).toEqual('Error: Http failure response for http://localhost:8080/intern/forms/123/tasks/csv: 404 Not Found');
    //         done();
    //     });
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks/csv', 'GET', '',
    //         { status: 404, statusText: 'Not Found' });
    // });

    /*
        INPUT PARAMS ERRORS
    */
    inputErrors.forEach((test) => {
        it('should fail ' + test.func + ' with missing data', (done) => {
            service[test.func](test.param1, test.param2).catch((error) => {
                expect(error.toString()).toEqual('Error: ' + test.missing + ' is required');
                done();
            });
        });
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
