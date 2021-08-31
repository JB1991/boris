import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';

import { FilloutComponent } from './fillout.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';
import { environment } from '@env/environment';

describe('Fragebogen.Fillout.FilloutComponent', () => {
    let component: FilloutComponent;
    let fixture: ComponentFixture<FilloutComponent>;

    const getPublicForm = require('../../../testdata/fragebogen/get-public-form.json');
    const getPublicTask = require('../../../testdata/fragebogen/get-public-task.json');
    const taskContent = require('../../../testdata/fragebogen/task-content.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ])
            ],
            providers: [
                Title,
                AlertsService,
                LoadingscreenService,
                FormAPIService
            ],
            declarations: [
                FilloutComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FilloutComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges();
    }));

    /**
     * ngOnInit
     */
    it('should create with pin', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('123');
        spyOn(component, 'loadData');
        component.ngAfterViewInit();
        expect(component.loadData).toHaveBeenCalledTimes(1);
        expect(component.pin).toBe('123');
    });


    it('should create with id', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.callFake((param) => {
            if (param === 'id') {
                return '123';
            }
            return null;
        });
        spyOn(component, 'loadForm');
        component.ngAfterViewInit();
        expect(component.loadForm).toHaveBeenCalledTimes(1);
        expect(component.loadForm).toHaveBeenCalledWith('123');
    });

    /**
     * SET LANGUAGE
     */
    it('should set language', () => {
        component.wrapper = { survey: { locale: 'de', getUsedLocales: () => [] } } as any;
        component.language = 'en';
        component.setLanguage();
        expect(component.wrapper?.survey?.locale).toEqual('en');
    });

    /**
     * LOAD FORM
     */
    it('should load form', fakeAsync(() => {
        spyOn(component.formapi, 'getPublicForm').and.returnValue(Promise.resolve(getPublicForm));

        component.loadForm('123');
        tick();
        expect(component.form).toEqual(getPublicForm.form);
        expect(component.language).toEqual(getPublicForm.form.content.locale);
        flush();
    }));

    it('should fail to load form', fakeAsync(() => {
        spyOn(component.formapi, 'getPublicForm').and.returnValue(Promise.reject('Failed to load form'));

        component.loadForm('123');
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
            'Failed to load form');
    }));

    /**
     * LOAD Data
     */
    it('should load data', (done) => {
        spyOn(component.formapi, 'getPublicTask').and.returnValue(Promise.resolve(getPublicTask));
        spyOn(component.formapi, 'getPublicForm').and.returnValue(Promise.resolve(getPublicForm));
        component.pin = '123';
        component.loadData().then(() => {
            expect(component.language).toEqual(getPublicForm.form.content.locale);
            done();
        });
    });

    it('should fail to load data', (done) => {
        spyOn(component.formapi, 'getPublicTask').and.returnValue(Promise.resolve(getPublicTask));
        spyOn(component.formapi, 'getPublicForm').and.returnValue(Promise.reject('Failed to load form'));
        component.pin = '123';
        component.loadData().then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
                'Failed to load form');
            done();
        });
    });

    it('should crash to load data', (done) => {
        component.loadData().catch(error => {
            expect(error.toString()).toEqual('Error: pin is required');
            done();
        });
    });

    /**
     * SUBMIT TASK
     */
    it('should submit task', fakeAsync(() => {
        spyOn(component.formapi, 'createPublicTask').and.returnValue(Promise.resolve(getPublicTask));
        component.submitTask('123', {
            result: getPublicTask.task.content,
            options: {
                showDataSaving: () => { },
                showDataSavingClear: () => { },
                showDataSavingError: () => { }
            }
        });
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich',
            'Ihre Daten wurden erfolgreich gespeichert.');
    }));

    it('should fail to submit task', fakeAsync(() => {
        spyOn(component.formapi, 'createPublicTask').and.returnValue(Promise.reject('Failed to submit task'));
        component.submitTask('123', {
            result: getPublicTask.task.content,
            options: {
                showDataSaving: () => { },
                showDataSavingClear: () => { },
                showDataSavingError: () => { }
            }
        });
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen',
            'Failed to submit task');
    }));

    /**
     * SUBMIT
     */
    it('should submit data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.resolve(getPublicTask));
        component.submit({
            result: taskContent,
            options: {
                showDataSaving: () => { },
                showDataSavingClear: () => { },
                showDataSavingError: () => { }
            }
        });
        fixture.detectChanges();
        tick();
        expect(component.data.UnsavedChanges).toBeFalse();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich',
            'Ihre Daten wurden erfolgreich gespeichert.');
    }));

    it('should fail to submit data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.reject('Failed to submit data'));
        component.submit({
            result: taskContent,
            options: {
                showDataSaving: () => { },
                showDataSavingClear: () => { },
                showDataSavingError: () => { }
            }
        });
        fixture.detectChanges();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen',
            'Failed to submit data');
    }));

    /**
     * PROGRESS
     */
    it('should progress result', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.resolve(getPublicTask));
        component.progress(taskContent);
        fixture.detectChanges();
        tick();
        expect(component.data.UnsavedChanges).toBeFalse();
    }));

    it('should fail to progress data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.reject('Failed to submit data'));
        component.progress(taskContent);
        fixture.detectChanges();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen',
            'Failed to submit data');
    }));

    it('should return (submitted === true)', () => {
        spyOn(component.formapi, 'updatePublicTask');
        component.submitted = true;
        fixture.detectChanges();
        component.progress(taskContent);
        expect(component.formapi.updatePublicTask).toHaveBeenCalledTimes(0);
    });

    /**
     * CHANGED
     */
    it('should set unsavedchanges', () => {
        expect(component.getUnsavedChanges()).toBeFalse();
        component.changed('data');
        expect(component.getUnsavedChanges()).toBeTrue();
    });

    /**
     * ERROR for submitTask, loadData, submit, progress
     */
    it('should throw error', () => {
        expect(() => {
            component.submitTask('', {});
        }).toThrowError('id is required');
        expect(() => {
            component.submitTask('123', null);
        }).toThrowError('no data provided');
        expect(() => {
            component.submit('');
        }).toThrowError('no data provided');
        expect(() => {
            component.progress(null);
        }).toThrowError('no data provided');
    });

    /**
     * CAN DEACTIVATE
     */
    it('should not leave page', () => {
        expect(component.canDeactivate()).toBeTrue();
        spyOn(window, 'confirm').and.returnValue(true);

        environment.production = true;
        expect(component.canDeactivate()).toEqual(!component.getUnsavedChanges());
        environment.production = false;
    });
});

@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
