import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DetailsComponent } from './details.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService } from '../formapi.service';
import { SurveyjsModule } from '../surveyjs/surveyjs.module';

describe('Fragebogen.Details.DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;

    const formSample = require('../../../assets/fragebogen/intern-get-forms-id.json');
    const formSampleCreated = require('../../../assets/fragebogen/intern-get-forms-id-created.json');
    const deleteSample = require('../../../assets/fragebogen/intern-delete-forms-id.json');
    const taskSample = require('../../../assets/fragebogen/intern-get-tasks.json');

    // tslint:disable-next-line: max-func-body-length
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                SurveyjsModule,
                PaginationModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockDashboardComponent }
                ])
            ],
            providers: [
                Title,
                AuthService,
                AlertsService,
                LoadingscreenService,
                FormAPIService
            ],
            declarations: [
                DetailsComponent,
                MockMaketaskComponent,
                MockPublishComponent,
                MockCommentComponent,
                MockSettingsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        spyOn(component, 'loadData');
        component.id = '123';
        component.ngOnInit();
        expect(component.loadData).toHaveBeenCalledTimes(1);
    });

    it('should not create', () => {
        component.id = null;
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
    });

    /**
     * LOAD DATA
     */
    // it('should load data with tasks', (done) => {
    //     spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.resolve(formSample.data));
    //     spyOn(component.formapi, 'getInternFormTasks').and.returnValue(Promise.resolve(taskSample));

    //     component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
    //         expect(component.data.form).toEqual(formSample.data);
    //         expect(component.data.form.status).toEqual('published');
    //         expect(component.data.tasksList).toEqual(taskSample.data);
    //         done();
    //     });
    // });

    // it('should load data without tasks', (done) => {
    //     spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.resolve(formSampleCreated.data));

    //     component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
    //         expect(component.data.form).toEqual(formSampleCreated.data);
    //         expect(component.data.form.status).toEqual('created');
    //         expect(component.data.tasksList.length).toEqual(0);
    //         done();
    //     });
    // });

    // it('should fail load data', (done) => {
    //     spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.reject('Failed'));

    //     component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
    //         expect(component.data.form).toBeNull();
    //         expect(component.data.tasksList.length).toEqual(0);
    //         expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //         expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
    //             'Laden fehlgeschlagen', 'Failed');
    //         done();
    //     });
    // });

    // it('should crash', () => {
    //     component.loadData(null).catch(() => {
    //         return new Error('id is required');
    //     });
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    // });

    // /**
    //  * DELETE FORM
    //  */
    // it('should delete form', fakeAsync(() => {
    //     component.data.form = JSON.parse(JSON.stringify(formSample.data));
    //     const spy = spyOn(component.formapi, 'deleteInternForm').and.callFake(() => {
    //         return Promise.resolve(deleteSample.data);
    //     });

    //     spyOn(window, 'confirm').and.returnValue(true);

    //     component.deleteForm();

    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
    //         'Das Formular wurde erfolgreich gelöscht.');
    // }));

    // it('should not delete form', () => {
    //     spyOn(window, 'confirm').and.returnValue(false);
    //     component.deleteForm();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    // });

    // it('should fail delete form', fakeAsync(() => {
    //     component.data.form = JSON.parse(JSON.stringify(formSample.data));
    //     spyOn(component.formapi, 'deleteInternForm').and
    //         .returnValue(Promise.reject('Failed'));
    //     spyOn(window, 'confirm').and.returnValue(true);
    //     component.deleteForm();

    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
    //         'Löschen fehlgeschlagen', 'Failed');
    // }));

    // /**
    //  * ARCHIVE FORM
    //  */
    // it('should archive form', fakeAsync(() => {
    //     component.data.form = JSON.parse(JSON.stringify(formSample.data));
    //     const spy = spyOn(component.formapi, 'updateInternForm').and
    //         .returnValue(Promise.resolve(formSample.data));

    //     spyOn(window, 'confirm').and.returnValue(true);

    //     component.archiveForm();

    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular archiviert',
    //         'Das Formular wurde erfolgreich archiviert.');
    // }));

    // it('should not archive form', () => {
    //     spyOn(window, 'confirm').and.returnValue(false);
    //     component.archiveForm();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    // });

    // it('should fail archive form', fakeAsync(() => {
    //     component.data.form = JSON.parse(JSON.stringify(formSample.data));
    //     spyOn(component.formapi, 'updateInternForm').and
    //         .returnValue(Promise.reject('Failed'));
    //     spyOn(window, 'confirm').and.returnValue(true);
    //     component.archiveForm();

    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
    //         'Archivieren fehlgeschlagen', 'Failed');
    // }));

    /**
     * DELETE TASK
     */
    // it('should delete task', fakeAsync(() => {
    //     component.data.tasksList = JSON.parse(JSON.stringify(taskSample.data));
    //     spyOn(component, 'updateTasks');
    //     spyOn(component.formapi, 'deleteInternTask').and.returnValue(Promise.resolve('deleted task'));

    //     spyOn(window, 'confirm').and.returnValue(true);

    //     component.deleteTask(0);
    //     tick();
    //     expect(component.data.tasksList.length).toEqual(1);

    //     component.deleteTask(0);
    //     tick();
    //     expect(component.data.tasksList.length).toEqual(0);

    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Antwort gelöscht',
    //         'Die Antwort wurde erfolgreich gelöscht.');
    // }));

    // it('should not delete task', () => {
    //     component.data.tasksList = JSON.parse(JSON.stringify(taskSample.data));
    //     spyOn(window, 'confirm').and.returnValue(false);
    //     component.deleteTask(0);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    // });

    // it('should fail delete task', () => {
    //     component.data.tasksList = JSON.parse(JSON.stringify(taskSample.data));

    //     expect(function () {
    //         component.deleteTask(-1);
    //     }).toThrowError('invalid i');

    //     expect(function () {
    //         component.deleteTask(3);
    //     }).toThrowError('invalid i');
    // });

    // it('should fail delete task 404', fakeAsync(() => {
    //     component.data.tasksList = JSON.parse(JSON.stringify(taskSample.data));
    //     spyOn(component.formapi, 'deleteInternTask').and.callFake(() => {
    //         return Promise.reject(new Error('Failed'));
    //     });

    //     spyOn(window, 'confirm').and.returnValue(true);

    //     component.deleteTask(0);
    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
    //         'Löschen fehlgeschlagen', 'Error: Failed');
    // }));

    /**
     * OPEN TASK
     */
    it('should open task', () => {
        component.data.tasksList = JSON.parse(JSON.stringify(taskSample.data));
        expect(function () {
            component.openTask(0);
        }).toThrowError('Cannot read property \'open\' of undefined');
    });

    it('should open task crash', () => {
        expect(function () {
            component.openTask(-1);
        }).toThrowError('invalid i');
        expect(function () {
            component.openTask(2);
        }).toThrowError('invalid i');
    });

    /**
     * UPDATE TASK
     */
    // it('should update tasks', (done) => {
    //     spyOn(component.formapi, 'getInternFormTasks').and.returnValue(Promise.resolve(taskSample));
    //     component.taskStatus = 'created';
    //     component.id = '123';

    //     component.updateTasks(true).then(() => {
    //         expect(component.data.tasksCountTotal).toEqual(2);
    //         done();
    //     });
    // });

    // it('should update tasks 2', (done) => {
    //     spyOn(component.formapi, 'getInternFormTasks').and.returnValue(Promise.resolve({
    //         data: [],
    //         total: 100
    //     }));
    //     component.taskStatus = 'created';
    //     component.id = '123';

    //     component.updateTasks(true).then(() => {
    //         expect(component.data.taskPageSizes.length).toEqual(10);
    //         done();
    //     });
    // });

    // it('should fail to update tasks', (done) => {
    //     spyOn(component.formapi, 'getInternFormTasks').and.returnValue(Promise.reject('Failed to update tasks'));
    //     component.taskStatus = 'created';
    //     component.id = '123';

    //     component.updateTasks(false).then(() => {
    //         expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //         expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
    //             'Failed to update tasks');
    //         done();
    //     });
    // });

    // it('should change sort order', () => {
    //     spyOn(component, 'updateTasks');
    //     component.taskOrder = 'asc';
    //     component.taskSort = 'id';

    //     component.changeTaskSort('id');
    //     expect(component.taskOrder).toEqual('desc');
    //     component.changeTaskSort('id');
    //     expect(component.taskOrder).toEqual('asc');
    // });

    // it('should reset sort order', () => {
    //     spyOn(component, 'updateTasks');
    //     component.taskOrder = 'desc';
    //     component.taskSort = 'id';

    //     component.changeTaskSort('pin');
    //     expect(component.taskOrder).toEqual('asc');
    //     expect(component.taskSort).toEqual('pin');
    // });
});

@Component({
    selector: 'power-forms-details-comment',
    template: ''
})
class MockCommentComponent { }
@Component({
    selector: 'power-forms-details-maketask',
    template: ''
})
class MockMaketaskComponent { }
@Component({
    selector: 'power-forms-details-publish',
    template: ''
})
class MockPublishComponent { }
@Component({
    selector: 'power-forms-details-settings',
    template: ''
})
class MockSettingsComponent { }
@Component({
    selector: 'power-forms-dashboard',
    template: ''
})
class MockDashboardComponent { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
