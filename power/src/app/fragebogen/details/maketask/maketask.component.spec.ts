import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { MaketaskComponent } from './maketask.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.MaketaskComponent', () => {
    let component: MaketaskComponent;
    let fixture: ComponentFixture<MaketaskComponent>;
    // let httpTestingController: HttpTestingController;

    const taskSample = require('../../../../assets/fragebogen/intern-get-tasks.json');

    beforeEach(waitForAsync(() => {
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
                AlertsService,
                FormAPIService
            ],
            declarations: [
                MaketaskComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MaketaskComponent);
            component = fixture.componentInstance;
            // fixture.detectChanges();
    
            spyOn(console, 'log');
            spyOn(component.alerts, 'NewAlert');
            // httpTestingController = TestBed.inject(HttpTestingController);
        });

    }));

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    //     expect(component.pinList.length).toEqual(0);
    // });

    // it('should open and close', () => {
    //     component.open();
    //     expect(component.modal.isShown).toBeTrue();
    //     component.close();
    //     expect(component.modal.isShown).toBeFalse();
    // });

    // it('should generate', () => {
    //     component.storage.form = { 'id': '123' };
    //     component.amount = 2;
    //     component.copy = false;

    //     component.Generate();
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=2', 'POST', taskSample);
    //     expect(component.pinList.length).toEqual(2);
    //     expect(component.storage.tasksList.length).toEqual(2);

    //     // copy to clipboard
    //     component.open();
    //     component.amount = 2;
    //     component.copy = true;
    //     component.Generate();
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=2', 'POST', taskSample);
    //     expect(component.pinList.length).toEqual(2);
    //     expect(component.storage.tasksList.length).toEqual(4);
    // });

    // it('should error', () => {
    //     component.storage.form = { 'id': '123' };
    //     component.amount = 2;

    //     component.Generate();
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=2', 'POST',
    //         { 'error': 'Internal Server Error' });
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert)
    //         .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Internal Server Error');
    // });

    // it('should error 404', () => {
    //     component.storage.form = { 'id': '123' };
    //     component.amount = 2;

    //     component.Generate();
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=2', 'POST', taskSample,
    //         { status: 404, statusText: 'Not Found' });
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Not Found');
    // });

    // it('should fail to generate', () => {
    //     component.storage.form = { 'id': '123' };
    //     component.amount = 1;

    //     component.Generate();
    //     answerHTTPRequest(environment.formAPI + 'intern/forms/123/tasks?number=1', 'POST', null);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', '123');
    // });

    // it('should crash', () => {
    //     expect(function () {
    //         component.amount = 0;
    //         component.Generate();
    //     }).toThrowError('Invalid bounds for variable amount');

    //     expect(function () {
    //         component.amount = 200;
    //         component.Generate();
    //     }).toThrowError('Invalid bounds for variable amount');
    // });

    // /**
    //  * Mocks the API by taking HTTP requests form the queue and returning the answer
    //  * @param url The URL of the HTTP request
    //  * @param method HTTP request method
    //  * @param body The body of the answer
    //  * @param opts Optional HTTP information of the answer
    //  */
    // function answerHTTPRequest(url, method, body, opts?) {
    //     // Take HTTP request from queue
    //     const request = httpTestingController.expectOne(url);
    //     expect(request.request.method).toEqual(method);

    //     // Return the answer
    //     request.flush(deepCopy(body), opts);
    // }

    // function deepCopy(data) {
    //     return JSON.parse(JSON.stringify(data));
    // }

    afterEach(() => {
        // Verify that no requests are remaining
        // httpTestingController.verify();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
