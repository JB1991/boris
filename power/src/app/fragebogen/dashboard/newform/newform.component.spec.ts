import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@env/environment';
import {By} from '@angular/platform-browser';

import { NewformComponent } from './newform.component';
import { StorageService } from '../storage.service';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { FormAPIService, Form } from '@app/fragebogen/formapi.service';
import { of, throwError, Observable } from 'rxjs';
import { FileCheck } from 'ngx-bootstrap-icons';

describe('Fragebogen.Dashboard.Newform.NewformComponent', () => {
    let component: NewformComponent;
    let fixture: ComponentFixture<NewformComponent>;
    let httpTestingController: HttpTestingController;
    let formapiService: FormAPIService;

    const formSample = require('../../../../assets/fragebogen/intern-get-forms-id.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ModalModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'forms/details/:id', component: MockDetailsComponent }
                ]),
                SharedModule
            ],
            providers: [
                BsModalService,
                StorageService,
                AlertsService
            ],
            declarations: [
                NewformComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NewformComponent);
        component = fixture.componentInstance;
        formapiService = TestBed.inject(FormAPIService);
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
        expect(component.templateList).toEqual([]);
        expect(component.tagList).toEqual([]);
        expect(component.searchText).toEqual('');
        expect(component.modal.isShown).toBeTrue();
        component.close();
        expect(component.modal.isShown).toBeFalse();
    });

    it('should set template', () => {
        const event = new TypeaheadMatch(
            {
                id: '123',
                title: 'Template'
            },
            'Template'
        );

        component.setTemplate(event);
        expect(component.template).toEqual('123');
    });

    it('should fail to fetch templates', async(() => {
        const spy = spyOn(formapiService, 'getInternForms').and.returnValue(Promise.reject('Failure'));

        component.fetchTemplates();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        });
    }));

    it('should fetch templates', (done) => {
        const spy = spyOn(formapiService, 'getInternForms').and.returnValue(Promise.resolve( 
            {
                data: [
                    {id: '123', content: null, title: 'Template', tags: [], owners: [], readers: [], created: null, status: 'created' },
                    {id: '321', content: null, title: 'Template', tags: [], owners: [], readers: [], created: null, status: 'created' }
                ],
                total: 2
            }
        ));
        
        component.fetchTemplates();

        spy.calls.mostRecent().returnValue.then(() => {
            fixture.detectChanges();
            expect(component.templateList.length).toEqual(2);
            expect(component.templateList[0].id).toEqual('123');
            done();
        });
    });

    it('should call fetchTemplates on keyup', () => {
        const searchElement = fixture.debugElement.query(By.css('#searchtemplate'));
        spyOn(component, 'fetchTemplates');
        searchElement.triggerEventHandler('keyup', {});
        expect(component.fetchTemplates).toHaveBeenCalled();
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
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Internal Server Error');

        component.NewForm();
        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'GET', formSample);
        answerHTTPRequest(environment.formAPI + 'intern/forms', 'POST',
            { 'error': 'Internal Server Error' });
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
            component.makeForm({ 'x': 5 });
        }).toThrowError('title is required');
    });

    it('should fail new form', () => {
        component.NewForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
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
/* vim: set expandtab ts=4 sw=4 sts=4: */
