import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageService } from './storage.service';
import { environment } from '@env/environment';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Public-Dashboard.StorageService', () => {
    let service: StorageService;
    let httpTestingController: HttpTestingController;

    const formId = 'bs63c2os5bcus8t5q0kg';
    const formsURL = environment.formAPI + 'public/forms?fields=id,title,published';

    const formSample = require('../../../assets/fragebogen/intern-get-forms-id.json');
    const formsListSample = require('../../../assets/fragebogen/public-get-forms.json');

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

    it('loadFormsList() should load a list of forms', () => {
        service.loadFormsList().subscribe(data => expect(data).toEqual(formsListSample));
        answerHTTPRequest(formsURL, 'GET', formsListSample);
    });

    it('loadForm() should load a form by id', () => {
        service.loadForm(formId).subscribe(data => expect(data).toEqual(formSample));
        answerHTTPRequest(environment.formAPI + 'public/forms/' + formId, 'GET', formSample);
    });

    it('should fail', () => {
        expect(function () {
            service.loadForm('');
        }).toThrowError('id is required');
    });

    it('resetService() should reset service to empty model', () => {
        service.formsList = formsListSample;
        expect(service.formsList).toEqual(formsListSample);
        service.resetService();
        expect(service.formsList).toEqual([]);
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
