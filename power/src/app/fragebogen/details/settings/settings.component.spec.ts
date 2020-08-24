import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { SettingsComponent } from './settings.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    let httpTestingController: HttpTestingController;

    const formSample = require('../../../../assets/fragebogen/form-sample.json');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ModalModule.forRoot(),
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                BsModalService,
                StorageService,
                AlertsService
            ],
            declarations: [
                SettingsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.alerts, 'NewAlert');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close', () => {
        component.storage.form = { 'id': '123' };
        component.open();
        expect(component.modal.isShown).toBeTrue();
        component.close();
        expect(component.modal.isShown).toBeFalse();
    });

    it('should update form', () => {
        component.storage.form = { 'id': '123'};
        component.tagList = [];
        component.ownerList = [];
        component.readerList = [];
        fixture.detectChanges();
        component.updateForm();

        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'POST', formSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gespeichert', 'Das Formular wurde erfolgreich gespeichert.');
    });

    it('should fail update form - data', () => {
        component.storage.form = { 'id': '123'};
        component.tagList = [];
        component.ownerList = [];
        component.readerList = [];
        fixture.detectChanges();
        component.updateForm();

        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'POST', { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Internal Server Error');
    });


    it('should fail update form - null', () => {
        component.storage.form = { 'id': '123'};
        component.tagList = [];
        component.ownerList = [];
        component.readerList = [];
        fixture.detectChanges();
        component.updateForm();

        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'POST', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', '123');
    });

    it('should fail update form - not found', () => {
        component.storage.form = { 'id': '123'};
        component.tagList = [];
        component.ownerList = [];
        component.readerList = [];
        fixture.detectChanges();
        component.updateForm();

        answerHTTPRequest(environment.formAPI + 'intern/forms/123', 'POST', formSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
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
