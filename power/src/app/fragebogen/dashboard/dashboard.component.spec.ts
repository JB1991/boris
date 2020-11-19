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

describe('Fragebogen.Dashboard.DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const getForms = require('../../../assets/fragebogen/get-forms.json');
    const getTasks = require('../../../assets/fragebogen/get-tasks.json');
    const getTags = require('../../../assets/fragebogen/get-tags.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ]),
                PaginationModule.forRoot()
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
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
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
        component.updateForms(false).then(() => {
            expect(component.forms).toEqual(getForms.forms);
            expect(component.formTotal).toEqual(getForms.total);
            done();
        });
    });

    it('should succeed updateForms', (done) => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.resolve(getForms));
        component.formStatus = 'created';
        component.formSort = 'extract';
        component.updateForms(false).then(() => {
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
        component.updateForms(false).then(() => {
            expect(component.formPageSizes.length).toEqual(10);
            done();
        });
    });

    it('should succeed updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.resolve(getTasks));
        component.taskStatus = 'created';
        component.updateTasks(false).then(() => {
            expect(component.tasks).toEqual(getTasks.tasks);
            expect(component.taskTotal).toEqual(getTasks.total);
            done();
        });
    });

    it('should succeed updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.returnValue(Promise.resolve(getTasks));
        component.taskSort = 'form.extract';
        component.updateTasks(false).then(() => {
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
        component.updateTasks(false).then(() => {
            expect(component.taskPageSizes.length).toEqual(10);
            done();
        });
    });

    it('should succeed updateTags', (done) => {
        spyOn(component.formAPI, 'getTags').and.returnValue(Promise.resolve(getTags));
        component.taskStatus = 'created';
        component.updateTags(false).then(() => {
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
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        component.deleteForm('123').then(() => {
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
        spyOn(window, 'confirm').and.callFake(function () {
            return false;
        });
        component.deleteForm('123').then(() => {
            expect(component.updateForms).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should succeed changeFormSort', (done) => {
        spyOn(component, 'updateForms');
        component.changeFormSort('updated');
        expect(component.formSort).toBe('updated');
        expect(component.formSortDesc).toBe(true);
        component.changeFormSort('updated');
        expect(component.formSort).toBe('updated');
        expect(component.formSortDesc).toBe(false);
        component.changeFormSort('extract');
        expect(component.formSort).toBe('extract');
        expect(component.formSortDesc).toBe(false);
        done();
    });

    it('should succeed changeTaskSort', (done) => {
        spyOn(component, 'updateTasks');
        component.changeTaskSort('updated');
        expect(component.taskSort).toBe('updated');
        expect(component.taskSortDesc).toBe(true);
        component.changeTaskSort('updated');
        expect(component.taskSort).toBe('updated');
        expect(component.taskSortDesc).toBe(false);
        component.changeTaskSort('form.extract');
        expect(component.taskSort).toBe('form.extract');
        expect(component.taskSortDesc).toBe(false);
        done();
    });

    /*
        Error
    */
    it('should fail updateForms', (done) => {
        spyOn(component.formAPI, 'getForms').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateForms(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail updateForms 2', (done) => {
        spyOn(component.formAPI, 'getForms').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateForms(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail updateTasks', (done) => {
        spyOn(component.formAPI, 'getTasks').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTasks(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail updateTasks 2', (done) => {
        spyOn(component.formAPI, 'getTasks').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTasks(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail updateTags', (done) => {
        spyOn(component.formAPI, 'getTags').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTags(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail updateTags 2', (done) => {
        spyOn(component.formAPI, 'getTags').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTags(false).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail deleteForm', (done) => {
        spyOn(component.formAPI, 'deleteForm').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        spyOn(component, 'updateForms');
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });
        component.deleteForm('').then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Löschen fehlgeschlagen', 'Error: fail');
            done();
        });
    });
});

@Component({
    selector: 'power-forms-dashboard-newform',
    template: ''
})
class MockNewformComponent {
    @ViewChild('modal') public modal: ModalminiComponent;
    @Output() public out = new EventEmitter<Form>();
    @Input() public tags: Array<string>;
}
@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
