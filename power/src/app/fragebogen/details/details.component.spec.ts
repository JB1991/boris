import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DetailsComponent } from './details.component';
import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService } from '../formapi.service';
import { SurveyjsModule } from '../surveyjs/surveyjs.module';

describe('Fragebogen.Details.DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    // let httpTestingController: HttpTestingController;

    const formSample = require('../../../assets/fragebogen/intern-get-forms-id.json');
    const formSampleCreated = require('../../../assets/fragebogen/intern-get-forms-id-created.json');
    const deleteSample = require('../../../assets/fragebogen/intern-delete-forms-id.json');
    const taskSample = require('../../../assets/fragebogen/intern-get-tasks.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                SurveyjsModule,
                PaginationModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                Title,
                StorageService,
                AuthService,
                AlertsService,
                LoadingscreenService,
                FormAPIService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => 123,
                            }
                        }
                    }
                }
            ],
            declarations: [
                DetailsComponent,
                MockMaketaskComponent,
                MockPublishComponent,
                MockCommentComponent,
                MockSettingsComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(DetailsComponent);
            component = fixture.componentInstance;

            spyOn(console, 'log');
            spyOn(component.router, 'navigate');
            spyOn(component.alerts, 'NewAlert');
        });
    }));

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should not create', () => {
        component.route.snapshot.paramMap.get = () => null;
        fixture.detectChanges();
        // expect(component.router.navigated).toEqual(true);
    });

    /**
     * LOAD DATA
     */
    it('should load data with tasks', (done) => {
        spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.resolve(formSample.data));
        spyOn(component.formapi, 'getInternFormTasks').and.returnValue(Promise.resolve(taskSample));

        component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
            expect(component.storage.form).toEqual(formSample.data);
            expect(component.storage.form.status).toEqual('published');
            expect(component.storage.tasksList).toEqual(taskSample.data);
            done();
        });
    });

    it('should load data without tasks', (done) => {
        spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.resolve(formSampleCreated.data));

        component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
            expect(component.storage.form).toEqual(formSampleCreated.data);
            expect(component.storage.form.status).toEqual('created');
            expect(component.storage.tasksList.length).toEqual(0);
            done();
        });
    });

    it('should fail load data', (done) => {
        spyOn(component.formapi, 'getInternForm').and.returnValue(Promise.reject('Failed'));

        component.loadData('bs63c2os5bcus8t5q0kg').then(() => {
            expect(component.storage.form).toBeNull();
            expect(component.storage.tasksList.length).toEqual(0);
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
                'Laden fehlgeschlagen', 'Failed');
            done();
        });
    });

    it('should crash', () => {
        component.loadData(null).catch(() => {
            return new Error('id is required');
        });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    /**
     * DELETE FORM
     */
    it('should delete form', fakeAsync(() => {
        component.storage.form = formSample.data;
        const spy = spyOn(component.formapi, 'deleteInternForm').and.callFake(() => {
            return Promise.resolve(deleteSample.data);
        });

        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteForm();

        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gelöscht',
            'Das Formular wurde erfolgreich gelöscht.');
    }));

    it('should not delete form', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail delete form', fakeAsync(() => {
        component.storage.form = formSample.data;
        spyOn(component.formapi, 'deleteInternForm').and
            .returnValue(Promise.reject('Failed'));
        spyOn(window, 'confirm').and.returnValue(true);
        component.deleteForm();

        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
            'Löschen fehlgeschlagen', 'Failed');
    }));

    // /**
    //  * ARCHIVE FORM
    //  */
    it('should archive form', fakeAsync(() => {
        component.storage.form = formSample.data;
        const spy = spyOn(component.formapi, 'updateInternForm').and
            .returnValue(Promise.resolve(formSample.data));

        spyOn(window, 'confirm').and.returnValue(true);

        component.archiveForm();

        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular archiviert',
            'Das Formular wurde erfolgreich archiviert.');
    }));

    it('should not archive form', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.archiveForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail archive form', fakeAsync(() => {
        component.storage.form = formSample.data;
        spyOn(component.formapi, 'updateInternForm').and
            .returnValue(Promise.reject('Failed'));
        spyOn(window, 'confirm').and.returnValue(true);
        component.archiveForm();

        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
            'Archivieren fehlgeschlagen', 'Failed');
    }));

    // /**
    //  * GET CSV
    //  */
    it('should get csv', fakeAsync(() => {
        component.storage.form = formSample.data;
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(component.formapi, 'getInternFormCSV').and
            .returnValue(Promise.resolve('CSV'));

        // navigator.msSaveBlob = null;
        // const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
        // spyOn(document, 'createElement').and.returnValue(spyObj);

        component.getCSV();

        tick();

        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    }));

    // it('should get csv 2', fakeAsync(() => {
    //     component.storage.form = formSample.data;
    //     spyOn(window, 'confirm').and.returnValue(true);
    //     spyOn(component.formapi, 'getInternFormCSV').and
    //         .returnValue(Promise.resolve('CSV'));

    //     navigator.msSaveBlob = () => true;
    //     const spyObj = jasmine.createSpyObj('pom', ['click', 'setAttribute']);
    //     spyOn(document, 'createElement').and.returnValue(spyObj);

    //     component.getCSV();

    //     tick();
    //     fixture.detectChanges();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    // }));

    it('should fail get csv', fakeAsync(() => {
        component.storage.form = formSample.data;
        spyOn(component.formapi, 'getInternFormCSV').and
            .returnValue(Promise.reject('Failed'));
        spyOn(window, 'confirm').and.returnValue(true);
        component.getCSV();

        tick();

        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
            'Download fehlgeschlagen', 'Failed');
    }));

    /**
     * DELETE TASK
     */
    it('should delete task', fakeAsync(() => {
        component.storage.tasksList = taskSample.data;
        spyOn(component.formapi, 'deleteInternTask').and.returnValue(Promise.resolve('deleted task'));

        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        tick();

        expect(component.storage.tasksList.length).toEqual(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Antwort gelöscht',
            'Die Antwort wurde erfolgreich gelöscht.');
    }));

    it('should not delete task', () => {
        component.storage.tasksList = taskSample.data;
        spyOn(window, 'confirm').and.returnValue(false);
        component.deleteTask(0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail delete task', () => {
        component.storage.tasksList = taskSample.data;

        expect(function () {
            component.deleteTask(-1);
        }).toThrowError('invalid i');

        expect(function () {
            component.deleteTask(3);
        }).toThrowError('invalid i');
    });

    it('should fail delete task 404', fakeAsync(() => {
        component.storage.tasksList = taskSample.data;
        spyOn(component.formapi, 'deleteInternTask').and.callFake(() => {
            return Promise.reject(new Error('Failed'));
        });

        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteTask(0);
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger',
            'Löschen fehlgeschlagen', 'Error: Failed');
    }));

    /**
     * OPEN TASK
     */
    it('should open task', () => {
        component.storage.tasksList = taskSample.data;
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

    // function answerInitialRequests() {
    //     answerHTTPRequest(formURL, 'GET', formSample);
    //     answerHTTPRequest(tasksURL, 'GET', taskSample);
    // }

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
        fixture.destroy();
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
class MockSettingsComponent { }
@Component({
    selector: 'power-forms-dashboard',
    template: ''
})
class MockDashboardComponent { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
