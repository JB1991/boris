import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { FilloutComponent } from './fillout.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';

describe('Fragebogen.Fillout.FilloutComponent', () => {
    let component: FilloutComponent;
    let fixture: ComponentFixture<FilloutComponent>;

    const accessSample = require('../../../assets/fragebogen/public-get-access.json');
    const formSample = require('../../../assets/fragebogen/intern-get-forms-id.json');
    const taskSample = require('../../../assets/fragebogen/intern-get-tasks-id.json');
    const submitSample = require('../../../assets/fragebogen/public-post-tasks.json');

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
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(FilloutComponent);
            component = fixture.componentInstance;

            spyOn(console, 'log');
            spyOn(component.router, 'navigate');
            spyOn(component.alerts, 'NewAlert');
            fixture.detectChanges(); // onInit
        });
    }));

    /**
     * ngOnInit
     */
    it('should create with pin', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('123');
        spyOn(component, 'loadData');
        component.ngOnInit();
        expect(component.loadData).toHaveBeenCalledTimes(1);
        expect(component.loadData).toHaveBeenCalledWith('123');
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
        component.ngOnInit();
        expect(component.loadForm).toHaveBeenCalledTimes(1);
        expect(component.loadForm).toHaveBeenCalledWith('123');
    });

    /**
     * SET LANGUAGE
     */
    it('should set language', () => {
        component.wrapper = <any>{ survey: { locale: 'de', getUsedLocales: () => [] } };
        component.language = 'en';
        component.setLanguage();
        expect(component.wrapper.survey.locale).toEqual('en');
    });

    /**
     * LOAD FORM
     */
    it('should load form', fakeAsync(() => {
        spyOn(component.formapi, 'getPublicForm').and.returnValue(Promise.resolve(formSample.data));

        component.loadForm('123');
        tick();
        expect(component.data.form).toEqual(formSample.data);
        expect(component.language).toEqual(formSample.data.content.locale);
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
     * SUBMIT TASK
     */
    it('should submit task', fakeAsync(() => {
        spyOn(component.formapi, 'createPublicTask').and.returnValue(Promise.resolve(taskSample.data));
        component.submitTask('123', taskSample.data.content);
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich',
            'Ihre Daten wurden erfolgreich gespeichert.');
    }));

    it('should fail to submit task', fakeAsync(() => {
        spyOn(component.formapi, 'createPublicTask').and.returnValue(Promise.reject('Failed to submit task'));
        component.submitTask('123',
            { result: taskSample.data.content, options: { showDataSavingError: () => { } } });
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen',
            'Failed to submit task');
    }));

    /**
     * LOAD DATA
     */
    // it('should load data', fakeAsync(() => {
    //     spyOn(component.formapi, 'getPublicAccess').and.returnValue(Promise.resolve(accessSample.data));
    //     component.loadData('123', 'factor');
    //     tick();
    //     expect(component.data.task).toEqual(accessSample.data);
    // }));

    // it('should fail to load data', fakeAsync(() => {
    //     spyOn(component.formapi, 'getPublicAccess').and.returnValue(Promise.reject('Failed to load data'));
    //     component.loadData('123');
    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
    //         'Failed to load data');
    // }));

    /**
     * SUBMIT
     */
    it('should submit data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.resolve(accessSample.data));
        component.data.task = JSON.parse(JSON.stringify(taskSample.data));
        component.submit(accessSample.data);
        fixture.detectChanges();
        tick();
        expect(component.data.UnsavedChanges).toBeFalse();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich',
            'Ihre Daten wurden erfolgreich gespeichert.');
    }));

    it('should fail to submit data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.reject('Failed to submit data'));
        component.data.task = JSON.parse(JSON.stringify(taskSample.data));
        component.submit({ result: submitSample, options: { showDataSavingError: () => { } } });
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
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.resolve(accessSample.data));
        component.data.task = JSON.parse(JSON.stringify(taskSample.data));
        component.progress(accessSample.data);
        fixture.detectChanges();
        tick();
        expect(component.data.UnsavedChanges).toBeFalse();
    }));

    it('should fail to progress data', fakeAsync(() => {
        spyOn(component.formapi, 'updatePublicTask').and.returnValue(Promise.reject('Failed to submit data'));
        component.data.task = JSON.parse(JSON.stringify(taskSample.data));
        component.progress(submitSample);
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
        component.progress(submitSample);
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
        expect(function () {
            component.loadData('', '123');
        }).toThrowError('pin is required');
        expect(function () {
            component.submitTask(null, {});
        }).toThrowError('id is required');
        expect(function () {
            component.submitTask('123', null);
        }).toThrowError('no data provided');
        expect(function () {
            component.submit('');
        }).toThrowError('no data provided');
        expect(function () {
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
