import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SettingsComponent } from './settings.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

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
                SettingsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        fixture.detectChanges(); // onInit
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * OPEN AND CLOSE
     */
    it('should open and close', () => {
        component.open({
            id: '123',
        });
        expect(component.modal.isOpen).toBeTrue();
        component.modal.close();
        expect(component.modal.isOpen).toBeFalse();
    });

    /**
     * UPDATE FORM
     */
    // it('should update form', fakeAsync(() => {
    //     spyOn(component.formapi, 'updateInternForm').and.returnValue(Promise.resolve(formSample.data));
    //     component.data.form = { 'id': '123' };
    //     component.tagList = [];
    //     component.ownerList = [];
    //     component.readerList = [];
    //     fixture.detectChanges();

    //     component.updateForm();
    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Formular gespeichert', 'Das Formular wurde erfolgreich gespeichert.');
    // }));

    // it('should fail update form - data', fakeAsync(() => {
    //     spyOn(component.formapi, 'updateInternForm').and.returnValue(Promise.reject('Failed to update form'));
    //     component.data.form = { 'id': '123' };
    //     component.tagList = [];
    //     component.ownerList = [];
    //     component.readerList = [];
    //     fixture.detectChanges();
    //     component.updateForm();
    //     tick();
    //     expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    //     expect(component.alerts.NewAlert)
    //         .toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Failed to update form');
    // }));
});
