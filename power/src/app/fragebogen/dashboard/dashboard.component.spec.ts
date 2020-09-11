import { Component, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';

import { DashboardComponent } from './dashboard.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { DataService } from './data.service';
import { FormAPIService } from '../formapi.service';

describe('Fragebogen.Dashboard.DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const internForms = require('../../../assets/fragebogen/intern-get-forms.json');
    const internTasks = require('../../../assets/fragebogen/intern-get-tasks.json');
    const internTags = require('../../../assets/fragebogen/intern-get-tags.json');

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
                DataService
            ],
            declarations: [
                DashboardComponent,
                MockNewformComponent
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
    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getInternForms').and.returnValue(Promise.resolve(internForms));
        component.formStatus = 'created';
        component.formAccess = 'public';
        component.formTitle = 'something';
        component.updateForms().then(() => {
            expect(component.data.forms).toEqual(internForms.data);
            expect(component.formTotal).toEqual(internForms.total);
            done();
        });
    });

    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getInternTasks').and.returnValue(Promise.resolve(internTasks));
        component.taskStatus = 'created';
        component.updateTasks().then(() => {
            expect(component.data.tasks).toEqual(internTasks.data);
            expect(component.taskTotal).toEqual(internTasks.total);
            done();
        });
    });

    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getInternTags').and.returnValue(Promise.resolve(internTags.data));
        component.taskStatus = 'created';
        component.updateTags().then(() => {
            expect(component.data.tags).toEqual(internTags.data);
            done();
        });
    });

    it('should succeed', (done) => {
        spyOn(component.formAPI, 'deleteInternForm').and.returnValue(Promise.resolve('123'));
        spyOn(component, 'updateForms');
        component.deleteForm('123').then(() => {
            done();
        });
    });

    it('should succeed', (done) => {
        spyOn(component, 'updateForms');
        component.changeFormSort('published');
        expect(component.formSort).toBe('published');
        expect(component.formOrder).toBe('asc');
        component.changeFormSort('published');
        expect(component.formSort).toBe('published');
        expect(component.formOrder).toBe('desc');
        component.changeFormSort('published');
        expect(component.formSort).toBe('published');
        expect(component.formOrder).toBe('asc');
        component.changeFormSort('title');
        expect(component.formSort).toBe('title');
        expect(component.formOrder).toBe('asc');
        done();
    });

    it('should succeed', (done) => {
        spyOn(component, 'updateTasks');
        component.changeTaskSort('submitted');
        expect(component.taskSort).toBe('submitted');
        expect(component.taskOrder).toBe('asc');
        component.changeTaskSort('submitted');
        expect(component.taskSort).toBe('submitted');
        expect(component.taskOrder).toBe('desc');
        component.changeTaskSort('submitted');
        expect(component.taskSort).toBe('submitted');
        expect(component.taskOrder).toBe('asc');
        done();
    });

    /*
        Error
    */
    it('should fail', (done) => {
        spyOn(component.formAPI, 'getInternForms').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateForms().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'getInternTasks').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTasks().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'getInternTags').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.updateTags().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'deleteInternForm').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        spyOn(component, 'updateForms');
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
}
@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
