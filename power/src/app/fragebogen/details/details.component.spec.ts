import { Component, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DetailsComponent } from './details.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService } from '../formapi.service';
import { User } from '../formapi.model';
import { SharedModule } from '@app/shared/shared.module';
import { SurveyjsModule } from '../surveyjs/surveyjs.module';

/* eslint-disable max-lines */
describe('Fragebogen.Details.DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;

    const getTags = require('../../../testdata/fragebogen/get-tags.json');
    const getForm = require('../../../testdata/fragebogen/get-form.json');
    const getTasks = require('../../../testdata/fragebogen/get-tasks.json');
    const getTask = require('../../../testdata/fragebogen/get-task.json');
    const getTaskContent = require('../../../testdata/fragebogen/get-task-content.json');

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                PaginationModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockDashboardComponent }
                ]),
                CommonModule,
                SurveyjsModule,
                SharedModule
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

        spyOn(console, 'error');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('123');
        spyOn(component, 'updateTasks');
        spyOn(component, 'updateForm');
        component.ngOnInit();
        expect(component.updateTasks).toHaveBeenCalledTimes(1);
    });

    it('should not create', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('');
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledTimes(2);
    });

    /**
     * UPDATE FORM
     */
    it('should updateForm', (done) => {
        spyOn(component.formapi, 'getForm').and.returnValue(Promise.resolve(getForm));
        component.id = '123';
        void component.updateForm(false).then(() => {
            expect(component.form).toEqual(getForm.form);
            done();
        });
    });


    it('should fail updateForm', (done) => {
        component.id = 'abc';
        spyOn(component.formapi, 'getForm').and.returnValue(Promise.reject('Failed 1'));

        void component.updateForm(true).then(() => {
            expect(component.form).toBeUndefined();
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should crash updateForm', (done) => {
        component.updateForm(false).catch(error => {
            expect(error.toString()).toEqual('Error: id is required');
            done();
        });
    });

    /**
     * DELETE FORM
     */
    it('should delete form', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'deleteForm').and.returnValue(Promise.resolve({
            id: '123',
            status: 200
        }));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.deleteForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
                'Das Formular wurde erfolgreich gelöscht.');
            done();
        });
    });

    it('should not delete form', (done) => {
        spyOn(window, 'confirm').and.returnValue(false);
        void component.deleteForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should fail delete form', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'deleteForm').and.returnValue(Promise.reject('fail'));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.deleteForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Löschen fehlgeschlagen', 'fail');
            done();
        });
    });

    // /**
    //  * ARCHIVE FORM
    //  */
    it('should archive form', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.resolve(getForm.form));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.archiveForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular archiviert',
                'Das Formular wurde erfolgreich archiviert.');
            done();
        });
    });

    it('should not archive form', (done) => {
        spyOn(window, 'confirm').and.returnValue(false);
        void component.archiveForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should fail archive form', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'updateForm').and
            .returnValue(Promise.reject('Failed 2'));
        spyOn(window, 'confirm').and.returnValue(true);
        void component.archiveForm().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Archivieren fehlgeschlagen', 'Failed 2');
            done();
        });
    });

    /**
     * DELETE TASK
     */
    it('should delete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component, 'updateTasks');
        spyOn(component.formapi, 'deleteTask').and.returnValue(Promise.resolve({
            id: '123',
            status: 200
        }));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.deleteTask(0).then(() => {
            expect(component.tasks.length).toEqual(1);
            void component.deleteTask(0).then(() => {
                expect(component.tasks.length).toEqual(0);
                expect(component.alerts.NewAlert).toHaveBeenCalledTimes(2);
                expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Antwort gelöscht',
                    'Die Antwort wurde erfolgreich gelöscht.');
                done();
            });
        });
    });

    it('should not delete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(window, 'confirm').and.returnValue(false);
        void component.deleteTask(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should fail delete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.deleteTask(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail delete task 2', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.deleteTask(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail delete task 404', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component.formapi, 'deleteTask').and.returnValue(Promise.reject('Failed 3'));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.deleteTask(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Löschen fehlgeschlagen', 'Failed 3');
            done();
        });
    });

    /**
     * NEW PIN
     */
    it('should generate new pin', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component, 'updateTasks');
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.resolve({
            message: 'success',
            status: 200
        }));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.newPin(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Neue Pin generiert',
                'Die neue Pin wurde erfolgreich generiert.');
            done();
        });
    });

    it('should not generate new pin', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(window, 'confirm').and.returnValue(false);
        void component.newPin(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should fail generate new pin', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.newPin(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail generate new pin 2', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.newPin(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail generate new pin 404', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.reject('Failed 4'));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.newPin(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Neue Pin generieren fehlgeschlagen', 'Failed 4');
            done();
        });
    });

    /**
     * COMPLETE TASK
     */
    it('should complete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component, 'updateTasks');
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.resolve({
            message: 'success',
            status: 200
        }));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.completeTask(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Antwort abgeschlossen',
                'Die Antwort wurde erfolgreich abgeschlossen.');
            done();
        });
    });

    it('should not complete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(window, 'confirm').and.returnValue(false);
        void component.completeTask(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should fail complete task', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.completeTask(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail complete task 2', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        void component.completeTask(-1).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should fail complete task 404', (done) => {
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.reject('Failed 5'));

        spyOn(window, 'confirm').and.returnValue(true);

        void component.completeTask(0).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Antwort abschließen fehlgeschlagen', 'Failed 5');
            done();
        });
    });

    /**
     * OPEN TASK
     */
    it('should open task', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        fixture.detectChanges();

        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));

        spyOn(component.formapi, 'getTask').and.returnValue(Promise.resolve(getTaskContent));
        if (component.preview) {
            spyOn(component.preview, 'open');
        }

        void component.openTask(0).then(() => {
            expect(component.preview?.open).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should open task crash', () => {
        void component.openTask(-1);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    });

    /**
     * UPDATE TASK
     */
    it('should update tasks', (done) => {
        spyOn(component.formapi, 'getTasks').and.returnValue(Promise.resolve(getTasks));
        component.id = '123';

        void component.updateTasks().then(() => {
            expect(component.taskTotal).toEqual(2);
            done();
        });
    });

    it('should update tasks 2', (done) => {
        spyOn(component.formapi, 'getTasks').and.returnValue(Promise.resolve({
            tasks: [],
            total: 100,
            status: 200
        }));
        component.taskStatus = 'created';
        component.id = '123';

        void component.updateTasks().then(() => {
            expect(component.taskPageSizes.length).toEqual(10);
            done();
        });
    });

    it('should fail to update tasks', (done) => {
        spyOn(component.formapi, 'getTasks').and.returnValue(Promise.reject('Failed to update tasks'));
        component.id = '123';

        void component.updateTasks().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
                'Failed to update tasks');
            done();
        });
    });

    it('should change sort order', () => {
        spyOn(component, 'updateTasks');
        component.taskSortDesc = false;
        component.taskSort = 'id';

        component.changeTaskSort('id');
        expect(component.taskSortDesc).toEqual(true);
        component.changeTaskSort('id');
        expect(component.taskSortDesc).toEqual(false);
        component.changeTaskSort('pin');
        expect(component.taskSortDesc).toEqual(false);
    });

    it('should reset sort order', () => {
        spyOn(component, 'updateTasks');
        component.taskSortDesc = true;
        component.taskSort = 'id';

        component.changeTaskSort('pin');
        expect(component.taskSortDesc).toEqual(false);
        expect(component.taskSort).toEqual('pin');
    });

    /**
     * UPDATE TAGS
     */
    it('should update tags', (done) => {
        spyOn(component.formapi, 'getTags').and.returnValue(Promise.resolve(getTags));
        void component.updateTags().then(() => {
            expect(component.availableTags.length).toEqual(2);
            done();
        });
    });

    it('should not update tags', (done) => {
        spyOn(component.formapi, 'getTags').and.returnValue(Promise.reject('fail'));
        void component.updateTags().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalled();
            done();
        });
    });

    /**
     * UPDATE Form event
     */
    it('should updateFormEvent', (done) => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.resolve(getForm));
        spyOn(component, 'updateForm');
        void component.updateFormEvent({
            id: '123',
            tags: ['Hello'],
            groups: ['X'],
            owner: 'A'
        }).then(() => {
            expect(component.updateForm).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should not updateFormEvent', (done) => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.reject('fail'));
        spyOn(component, 'updateForm');
        void component.updateFormEvent({
            id: '123'
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    /**
     * PUBLISH Form Event
     */
    it('should publishFormEvent', (done) => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.resolve(getForm));
        spyOn(component, 'updateForm');
        void component.publishFormEvent({
            id: '123',
            access: 'public'
        }).then(() => {
            expect(component.updateForm).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should not publishFormEvent', (done) => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.reject('fail'));
        spyOn(component, 'updateForm');
        void component.publishFormEvent({
            id: '123',
            access: 'public'
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    /**
     * COMMENT Task Event
     */
    it('should commentTaskEvent', (done) => {
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.resolve(getTask));
        spyOn(component, 'updateTasks');
        void component.commentTaskEvent({
            id: '123',
            description: 'text'
        }).then(() => {
            expect(component.updateTasks).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should not commentTaskEvent', (done) => {
        spyOn(component.formapi, 'updateTask').and.returnValue(Promise.reject('fail'));
        spyOn(component, 'updateTasks');
        void component.commentTaskEvent({
            id: '123',
            description: 'text'
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    /**
     * CREATE Task Event
     */
    it('should createTaskEvent', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        if (component.form) {
            component.form.status = 'published';
        }
        component.tasks = JSON.parse(JSON.stringify(getTasks.tasks));
        fixture.detectChanges();

        spyOn(component.formapi, 'createTask').and.returnValue(Promise.resolve({
            ids: ['123'],
            pins: ['123456'],
            status: 200
        }));
        spyOn(component, 'updateTasks');
        void component.createTaskEvent({
            amount: 10,
            copyvalue: true
        }).then(() => {
            expect(component.updateTasks).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should not createTaskEvent', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'createTask').and.returnValue(Promise.reject('fail'));
        spyOn(component, 'updateTasks');
        void component.createTaskEvent({
            amount: 10,
            copyvalue: true
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    /**
     * UPDATE group and users
     */
    it('should updateGroups', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'getGroups').and.returnValue(Promise.resolve({ groups: ['A'], total: 1, status: 200 }));

        void component.updateGroups().then(() => {
            expect(component.availableGroups).toEqual(['A']);
            done();
        });
    });

    it('should updateUsers', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'getUsers').and.returnValue(Promise.resolve({ users: [{ name: 'X', id: '1' }], total: 1, status: 200 }));

        void component.updateUsers().then(() => {
            expect(component.availableUsers).toEqual([{ name: 'X', id: '1' }]);
            done();
        });
    });

    it('should not updateGroups', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'getGroups').and.returnValue(Promise.reject('fail'));

        void component.updateGroups().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should not updateUsers', (done) => {
        component.form = JSON.parse(JSON.stringify(getForm.form));
        spyOn(component.formapi, 'getUsers').and.returnValue(Promise.reject('fail'));

        void component.updateUsers().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            done();
        });
    });
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
class MockSettingsComponent {
    @Input() public availableTags = new Array<string>();
    @Input() public availableGroups = new Array<string>();
    @Input() public availableUsers = new Array<User>();
}
@Component({
    selector: 'power-forms-dashboard',
    template: ''
})
class MockDashboardComponent { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
