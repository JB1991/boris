import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { FormAPIService } from './formapi.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.FormAPIService', () => {
    let service: FormAPIService;
    let httpTestingController: HttpTestingController;

    const formsListSample = require('../../assets/fragebogen/forms-list-sample.json');
    const formSample = require('../../assets/fragebogen/form-sample.json');

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

    it('should load formlist with fields', (done) => {
        service.getInternFormList({ fields: 'id,title', status: 'published' }).then((value) => {
            expect(value).toEqual(formsListSample);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms?fields=id%2Ctitle&status=published',
            'GET', formsListSample);
    });

    it('should fail load formlist with empty response', (done) => {
        service.getInternFormList().catch((error) => {
            expect(error.toString()).toEqual('Error: API returned an empty response');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms', 'GET', null);
    });

    it('should fail load formlist with empty data', (done) => {
        service.getInternFormList().catch((error) => {
            expect(error.toString()).toEqual('Error: API returned an invalid response');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms', 'GET', {});
    });

    it('should fail load formlist with error response', (done) => {
        service.getInternFormList().catch((error) => {
            expect(error.toString()).toEqual('Error: API returned error: Toast');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms', 'GET', { error: 'Toast' });
    });

    it('should fail load formlist with http error', (done) => {
        service.getInternFormList().catch((error) => {
            expect(error.toString()).toEqual('Error: Http failure response for http://localhost:8080/intern/forms: 404 Not Found');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms', 'GET', null,
            { status: 404, statusText: 'Not Found' });
    });

    it('should load form with fields', (done) => {
        service.getInternForm('123', { fields: 'id,title' }).then((value) => {
            expect(value).toEqual(formSample['data']);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms/123?fields=id%2Ctitle', 'GET', formSample);
    });

    it('should not load form with missing id', (done) => {
        service.getInternForm('').catch((error) => {
            expect(error.toString()).toEqual('Error: id is required');
            done();
        });
    });

    it('should fail load form with empty response', (done) => {
        service.getInternForm('123').catch((error) => {
            expect(error.toString()).toEqual('Error: API returned an empty response');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', null);
    });

    it('should fail load form with empty data', (done) => {
        service.getInternForm('123').catch((error) => {
            expect(error.toString()).toEqual('Error: API returned an invalid response');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', {});
    });

    it('should fail load form with error response', (done) => {
        service.getInternForm('123').catch((error) => {
            expect(error.toString()).toEqual('Error: API returned error: Toast');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', { error: 'Toast' });
    });

    it('should fail load form with http error', (done) => {
        service.getInternForm('123').catch((error) => {
            expect(error.toString()).toEqual('Error: Http failure response for http://localhost:8080/intern/forms/123: 404 Not Found');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', null,
            { status: 404, statusText: 'Not Found' });
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
