import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { MaketaskComponent } from './maketask.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.MaketaskComponent', () => {
    let component: MaketaskComponent;
    let fixture: ComponentFixture<MaketaskComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                RouterTestingModule.withRoutes([]),
                SharedModule
            ],
            providers: [
                AlertsService,
                FormAPIService
            ],
            declarations: [
                MaketaskComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MaketaskComponent);
            component = fixture.componentInstance;

            spyOn(console, 'log');
            spyOn(component.alerts, 'NewAlert');
            fixture.detectChanges();
        });
    }));

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.pinList.length).toEqual(0);
    });

    it('should open and close', () => {
        fixture.detectChanges();
        component.open();
        expect(component.modal.isOpen).toBeTrue();
        component.close();
        expect(component.modal.isOpen).toBeFalse();
    });

    // it('should generate', fakeAsync(() => {
    //     spyOn(component.formapi, 'createInternFormTasks').and.returnValue(Promise.resolve(
    //         {
    //             data: [
    //                 {
    //                     id: '123',
    //                     content: {},
    //                     'form-id': 'bs8t7ifp9r1b3pt5qkr0',
    //                     pin: 'oGxOwQeS',
    //                     factor: 'string',
    //                     created: '2020-09-22T22:29:36.814Z',
    //                     accessed: '2020-09-22T22:29:36.814Z',
    //                     submitted: '2020-09-22T22:29:36.814Z',
    //                     description: 'description',
    //                     status: 'created'
    //                 },
    //                 {
    //                     id: '123',
    //                     content: {},
    //                     'form-id': 'bs8t7ifp9r1b3pt5qkr0',
    //                     pin: 'oGxOwQeS',
    //                     factor: 'string',
    //                     created: '2020-09-22T22:29:36.814Z',
    //                     accessed: '2020-09-22T22:29:36.814Z',
    //                     submitted: '2020-09-22T22:29:36.814Z',
    //                     description: 'description',
    //                     status: 'created'
    //                 }
    //             ],
    //             total: 2
    //         }
    //     ));
    //     component.data.form = { 'id': '123' };
    //     component.amount = 2;
    //     component.copy = false;

    //     component.Generate();
    //     tick();
    //     expect(component.pinList.length).toEqual(2);
    //     expect(component.data.tasksList.length).toEqual(2);

    //     component.open();
    //     component.copy = true;
    //     component.Generate();
    //     tick();
    //     expect(component.data.tasksList.length).toEqual(4);
    //     expect(component.pinList.length).toEqual(2);
    //     flush();
    // }));

    // it('should generate 2', fakeAsync(() => {
    //     spyOn(component.formapi, 'createInternFormTasks').and.returnValue(Promise.resolve(
    //         {
    //             data: [
    //                 {
    //                     id: '123',
    //                     content: {},
    //                     'form-id': 'bs8t7ifp9r1b3pt5qkr0',
    //                     pin: 'oGxOwQeS',
    //                     factor: 'string',
    //                     created: '2020-09-22T22:29:36.814Z',
    //                     accessed: '2020-09-22T22:29:36.814Z',
    //                     submitted: '2020-09-22T22:29:36.814Z',
    //                     description: 'description',
    //                     status: 'created'
    //                 },
    //                 {
    //                     id: '123',
    //                     content: {},
    //                     'form-id': 'bs8t7ifp9r1b3pt5qkr0',
    //                     pin: 'oGxOwQeS',
    //                     factor: 'string',
    //                     created: '2020-09-22T22:29:36.814Z',
    //                     accessed: '2020-09-22T22:29:36.814Z',
    //                     submitted: '2020-09-22T22:29:36.814Z',
    //                     description: 'description',
    //                     status: 'created'
    //                 }
    //             ],
    //             total: 2
    //         }
    //     ));
    //     component.data.tasksCountTotal = 100;
    //     component.data.form = { 'id': '123' };
    //     component.amount = 2;
    //     component.copy = false;

    //     component.Generate();
    //     tick();
    //     expect(component.pinList.length).toEqual(2);
    //     expect(component.data.tasksList.length).toEqual(2);

    //     component.open();
    //     component.copy = true;
    //     component.Generate();
    //     tick();
    //     expect(component.data.tasksList.length).toEqual(4);
    //     expect(component.pinList.length).toEqual(2);
    //     flush();
    // }));

    it('should crash', () => {
        expect(function () {
            component.amount = 0;
            component.Generate();
        }).toThrowError('Invalid bounds for variable amount');

        expect(function () {
            component.amount = 200;
            component.Generate();
        }).toThrowError('Invalid bounds for variable amount');
    });

    // it('should error', fakeAsync(() => {
    //     spyOn(component.formapi, 'createInternFormTasks').and.returnValue(Promise.reject('Failed to generate'));
    //     component.data.form = { 'id': '123' };
    //     component.amount = 2;

    //     component.Generate();
    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert)
    //         .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Failed to generate');
    // }));

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
