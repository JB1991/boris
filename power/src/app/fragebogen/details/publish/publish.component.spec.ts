import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PublishComponent } from './publish.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.PublishComponent', () => {
    let component: PublishComponent;
    let fixture: ComponentFixture<PublishComponent>;

    const formSample = require('../../../../assets/fragebogen/intern-get-forms-id.json');

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
                PublishComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PublishComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges(); // onInit
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * OPEN AND CLOSE
     */
    it('should open and close', () => {
        component.open();
        expect(component.modal.isOpen).toBeTrue();
        component.close();
        expect(component.modal.isOpen).toBeFalse();
    });

    /**
     * PUBLISH
     */
    it('should publish', fakeAsync(() => {
        spyOn(component.formapi, 'updateInternForm').and.returnValue(Promise.resolve(formSample.data));
        spyOn(window, 'confirm').and.returnValue(true);
        component.data.form = { 'id': '123' };
        component.pin = 'pin6';
        component.open();

        component.Publish();
        tick();
        expect(component.modal.isOpen).toBeFalse();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular veröffentlicht',
            'Das Formular wurde erfolgreich veröffentlicht.');
        flush();
    }));

    it('should not publish', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.Publish();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should error', fakeAsync(() => {
        spyOn(component.formapi, 'updateInternForm').and.returnValue(Promise.reject('Failed to publish'));
        spyOn(window, 'confirm').and.returnValue(true);
        component.data.form = { 'id': '123' };

        component.Publish();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Veröffentlichen fehlgeschlagen', 'Failed to publish');
    }));

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
