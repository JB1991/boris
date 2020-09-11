import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { By } from '@angular/platform-browser';
import { NewformComponent } from './newform.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormAPIService } from '@app/fragebogen/formapi.service';
import { DataService } from '../data.service';

describe('Fragebogen.Dashboard.Newform.NewformComponent', () => {
    let component: NewformComponent;
    let fixture: ComponentFixture<NewformComponent>;

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
                AlertsService,
                FormAPIService,
                DataService
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

    it('should open and close', () => {
        component.open();
        expect(component.templateList).toEqual([]);
        expect(component.tagList).toEqual([]);
        expect(component.searchText).toEqual('');
        expect(component.modal.isShown).toBeTrue();
        component.close();
        expect(component.modal.isShown).toBeFalse();
    });

    it('should set template', () => {
        const event = new TypeaheadMatch(
            {
                id: '123',
                title: 'Template'
            },
            'Template'
        );

        component.setTemplate(event);
        expect(component.template).toEqual('123');
    });

    it('should fail to fetch templates', waitForAsync(() => {
        const spy = spyOn(component.formAPI, 'getInternForms').and.returnValue(Promise.reject('Failure'));

        component.fetchTemplates();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        });
    }));

    it('should fetch templates', (done) => {
        const spy = spyOn(component.formAPI, 'getInternForms').and.returnValue(Promise.resolve(
            {
                data: [
                    {
                        id: '123', content: null, title: 'Template', tags: [], owners: [], readers: [],
                        created: null, status: 'created'
                    },
                    {
                        id: '321', content: null, title: 'Template', tags: [], owners: [], readers: [],
                        created: null, status: 'created'
                    }
                ],
                total: 2
            }
        ));

        component.fetchTemplates();

        spy.calls.mostRecent().returnValue.then(() => {
            fixture.detectChanges();
            expect(component.templateList.length).toEqual(2);
            expect(component.templateList[0].id).toEqual('123');
            done();
        });
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call fetchTemplates on keyup', () => {
        const searchElement = fixture.debugElement.query(By.css('#searchtemplate'));
        spyOn(component, 'fetchTemplates');
        searchElement.triggerEventHandler('keyup', {});
        expect(component.fetchTemplates).toHaveBeenCalled();
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
