import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { CommentComponent } from './comment.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;

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
                AlertsService,
                FormAPIService
            ],
            declarations: [
                CommentComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CommentComponent);
            component = fixture.componentInstance;
    
            spyOn(console, 'log');
            spyOn(component.alerts, 'NewAlert');
            fixture.detectChanges(); // onInit
        });
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * OPEN AND CLOSE
     */
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
    
    /**
     * SAVE
     */
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

    it('should save', fakeAsync(() => {
        spyOn(component.formapi, 'updateInternTask').and.returnValue(Promise.resolve(taskSample.data));
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        tick();
        
        expect(component.tasknr).toEqual(-1);
        expect(component.storage.tasksList[0].description).toEqual('Toast');
    }));

    it('should error', fakeAsync(() => {
        spyOn(component.formapi, 'updateInternTask').and.returnValue(Promise.reject('Toast failed'));
        component.storage.tasksList.push({ id: '123', description: '' });
        component.tasknr = 0;
        component.comment = 'Toast';

        component.save();
        tick();

        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Toast failed');
    }));

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
