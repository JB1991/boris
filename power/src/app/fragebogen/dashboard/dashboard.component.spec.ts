import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DashboardComponent } from './dashboard.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';
import { Form } from '@angular/forms';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { SharedModule } from '@app/shared/shared.module';

/* eslint-disable max-lines */
describe('Fragebogen.Dashboard.DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const getForms = require('../../../testdata/fragebogen/get-forms.json');
    const getTasks = require('../../../testdata/fragebogen/get-tasks.json');
    const getTags = require('../../../testdata/fragebogen/get-tags.json');

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ]),
                PaginationModule.forRoot(),
                SharedModule
            ],
            providers: [
                Title,
                AlertsService,
                LoadingscreenService,
                FormAPIService,
            ],
            declarations: [
                DashboardComponent,
                MockNewformComponent,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /*
        SUCCESS
    */
    it('should succeed updateForms', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.resolve(getForms));
        component.formStatus = 'created';
        component.formAccess = 'public';
        component.formSearch = 'something';
        void component.updateForms(false).then(() => {
            expect(component.forms).toEqual(getForms.forms);
            expect(component.formTotal).toEqual(getForms.total);
            done();
        });
    });

    it('should succeed updateForms', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.resolve(getForms));
        component.formStatus = 'created';
        component.formSort = 'extract';
        void component.updateForms(false).then(() => {
            expect(component.forms).toEqual(getForms.forms);
            expect(component.formTotal).toEqual(getForms.total);
            done();
        });
    });

    it('should succeed updateForms 2', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.resolve({
            forms: [],
            status: 200,
            total: 100
        }));
        void component.updateForms(false).then(() => {
            expect(component.formPageSizes.length).toEqual(10);
            done();
        });
    });

    it('should succeed updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.resolve(getTasks));
        component.taskStatus = 'created';
        void component.updateTasks(false).then(() => {
            expect(component.tasks).toEqual(getTasks.tasks);
            expect(component.taskTotal).toEqual(getTasks.total);
            done();
        });
    });

    it('should succeed updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.resolve(getTasks));
        component.taskSort = 'form.extract';
        void component.updateTasks(false).then(() => {
            expect(component.tasks).toEqual(getTasks.tasks);
            expect(component.taskTotal).toEqual(getTasks.total);
            done();
        });
    });

    it('should succeed updateTasks 2', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.resolve({
            tasks: [],
            total: 100,
            status: 200,
        }));
        component.taskStatus = 'created';
        void component.updateTasks(false).then(() => {
            expect(component.taskPageSizes.length).toEqual(10);
            done();
        });
    });

    it('should succeed updateTags', (done) => {
        spyOn(component.formAPI, 'getTags').and.returnValue(Promise.resolve(getTags));
        component.taskStatus = 'created';
        void component.updateTags(false).then(() => {
            expect(component.tags).toEqual(getTags.tags);
            done();
        });
    });

    it('should succeed deleteForm', (done) => {
        spyOn(component.formAPI, 'deleteForm').and.returnValue(Promise.resolve({
            id: '123',
            status: 200,
        }));
        spyOn(component, 'updateForms');
        spyOn(window, 'confirm').and.returnValue(true);
        void component.deleteForm('123').then(() => {
            expect(component.updateForms).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should succeed deleteForm 2', (done) => {
        spyOn(component.formAPI, 'deleteForm').and.returnValue(Promise.resolve({
            id: '123',
            status: 200,
        }));
        spyOn(component, 'updateForms');
        spyOn(window, 'confirm').and.returnValue(false);
        void component.deleteForm('123').then(() => {
            expect(component.updateForms).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should succeed changeFormSort', () => {
        spyOn(component, 'updateForms');
        component.formSort = 'content';
        component.formSortDesc = true;

        component.changeFormSort('updated');
        expect(component.formSort).toBe('updated');
        expect(component.formSortDesc).toBe(false);

        component.changeFormSort('updated');
        expect(component.formSort).toBe('updated');
        expect(component.formSortDesc).toBe(true);

        expect(component.updateForms).toHaveBeenCalledTimes(2);
    });

    it('should succeed changeTaskSort', () => {
        spyOn(component, 'updateTasks');
        component.taskSort = 'content';
        component.taskSortDesc = true;

        component.changeTaskSort('updated');
        expect(component.taskSort).toBe('updated');
        expect(component.taskSortDesc).toBe(false);

        component.changeTaskSort('updated');
        expect(component.taskSort).toBe('updated');
        expect(component.taskSortDesc).toBe(true);

        expect(component.updateTasks).toHaveBeenCalledTimes(2);
    });

    /*
        Error
    */
    it('should fail updateForms', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.reject('fail'));
        void component.updateForms(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail updateForms 2', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.reject('fail'));
        void component.updateForms(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.reject('fail'));
        void component.updateTasks(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail updateTasks 2', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.reject('fail'));
        void component.updateTasks(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail updateTags', (done) => {
        spyOn(component.formAPI, 'getTags').and.returnValue(Promise.reject('fail'));
        void component.updateTags(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail updateTags 2', (done) => {
        spyOn(component.formAPI, 'getTags').and.returnValue(Promise.reject('fail'));
        void component.updateTags(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail deleteForm', (done) => {
        spyOn(component.formAPI, 'deleteForm').and.returnValue(Promise.reject('fail'));
        spyOn(component, 'updateForms');
        spyOn(window, 'confirm').and.returnValue(true);
        void component.deleteForm('').then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'fail');
            done();
        });
    });
});

@Component({
    selector: 'power-forms-dashboard-newform',
    template: ''
})
class MockNewformComponent {
    @ViewChild('modal') public modal?: ModalminiComponent;
    @Output() public out = new EventEmitter<Form>();
    @Input() public tags: Array<string> = [];
}
@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
