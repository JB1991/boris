import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { CommentComponent } from './comment.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('Fragebogen.Details.CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;
    let httpTestingController: HttpTestingController;

    const taskSample = require('../../../../assets/fragebogen/intern-get-tasks-id.json');

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
                AlertsService
            ],
            declarations: [
                CommentComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CommentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.alerts, 'NewAlert');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open and close', () => {
        component.storage.tasksList.push({ id: '123', description: '' });
        component.open(0);
        expect(component.modal.isShown).toBeTrue();
        component.close();
        expect(component.modal.isShown).toBeFalse();
    });

    it('should fail open', () => {
        expect(function () {
            component.open(-1);
        }).toThrowError('invalid i');
        expect(function () {
            component.open(10);
        }).toThrowError('invalid i');
    });

    it('should fail save', () => {
        component.tasknr = -1;
        expect(function () {
            component.save();
        }).toThrowError('invalid i');
        component.tasknr = 1;
        expect(function () {
            component.save();
        }).toThrowError('invalid i');
    });

    it('should save', () => {
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        answerHTTPRequest(environment.formAPI + 'intern/tasks/123?description=Toast', 'POST', taskSample);
        expect(component.tasknr).toEqual(-1);
        expect(component.storage.tasksList[0].description).toEqual('Toast');
    });

    it('should error', () => {
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        answerHTTPRequest(environment.formAPI + 'intern/tasks/123?description=Toast', 'POST',
            { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Internal Server Error');
    });

    it('should error 2', () => {
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        answerHTTPRequest(environment.formAPI + 'intern/tasks/123?description=Toast', 'POST', '');
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', '0');
    });

    it('should error 404', () => {
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        answerHTTPRequest(environment.formAPI + 'intern/tasks/123?description=Toast', 'POST', taskSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
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
