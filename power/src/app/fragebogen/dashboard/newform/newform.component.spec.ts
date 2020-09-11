import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@env/environment';
import { By } from '@angular/platform-browser';

import { NewformComponent } from './newform.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormAPIService, Form } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Dashboard.Newform.NewformComponent', () => {
    let component: NewformComponent;
    let fixture: ComponentFixture<NewformComponent>;
    let formAPIService: FormAPIService;

    const formSample = require('../../../../assets/fragebogen/intern-get-forms-id.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ModalModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'forms/details/:id', component: MockDetailsComponent }
                ]),
                SharedModule,
                TypeaheadModule
            ],
            providers: [
                BsModalService,
                AlertsService
            ],
            declarations: [
                NewformComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NewformComponent);
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
        spyOn(component.formAPI, 'createInternForm').and.returnValue(Promise.resolve(formSample.data));
        component.title = 'something';
        component.makeForm({
            title: {
                default: 'example'
            }
        }).then(() => {
            done();
        });
    });

    /*
        Error
    */
    it('should fail', (done) => {
        spyOn(component.formAPI, 'createInternForm').and.callFake(() => {
            return Promise.reject(new Error('fail'));
        });
        component.title = 'something';
        component.makeForm({
            title: {
                default: 'example'
            }
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Error: fail');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'createInternForm');
        component.title = undefined;
        component.makeForm({
            title: {
                default: 'example'
            }
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Error: title is required');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'createInternForm');
        component.title = undefined;
        component.makeForm(null).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Error: template is required');
            done();
        });
    });
});

@Component({
    selector: 'power-formulars-details',
    template: ''
})
class MockDetailsComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
