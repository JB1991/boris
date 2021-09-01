import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NewformComponent } from './newform.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Dashboard.Newform.NewformComponent', () => {
    let component: NewformComponent;
    let fixture: ComponentFixture<NewformComponent>;

    const getForm = require('../../../../testdata/fragebogen/get-form.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms/details/:id', component: MockDetailsComponent }
                ]),
                SharedModule,
                TypeaheadModule.forRoot()
            ],
            providers: [
                AlertsService,
                FormAPIService,
            ],
            declarations: [
                NewformComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NewformComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open and close', () => {
        component.open();
        expect(component.templateList).toEqual([]);
        expect(component.tagList).toEqual([]);
        expect(component.searchText).toEqual('');
        expect(component.modal?.isOpen).toBeTrue();
        component.modal?.close();
        expect(component.modal?.isOpen).toBeFalse();
    });

    it('should fail to fetch templates', fakeAsync(() => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.reject('Failure'));

        component.fetchTemplates();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    }));

    it('should fetch templates', fakeAsync(() => {
        spyOn(component.formAPI, 'getForms').and.returnValue(Promise.resolve(
            {
                forms: [
                    {
                        id: '123', content: null, extract: 'Template', tags: [], groups: [],
                        created: '', status: 'created'
                    },
                    {
                        id: '321', content: null, extract: 'Template', tags: [], groups: [],
                        created: '', status: 'created'
                    }
                ],
                total: 2,
                status: 200,
            }
        ));

        component.fetchTemplates();
        tick();
        expect(component.templateList.length).toEqual(2);
        expect(component.templateList[0]).toEqual('Template');
    }));


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
        spyOn(component.formAPI, 'createForm').and.returnValue(Promise.resolve(getForm));
        spyOn(component.out, 'emit');
        component.title = 'something';
        component.makeForm({
            title: {
                default: 'example'
            }
        }).then(() => {
            expect(component.out.emit).toHaveBeenCalled();
            done();
        });
    });

    /*
        Error
    */
    it('should fail', (done) => {
        spyOn(component.formAPI, 'createForm').and.returnValue(Promise.reject('fail'));
        component.title = 'something';
        component.makeForm({
            title: {
                default: 'example'
            }
        }).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'fail');
            done();
        });
    });

    it('should fail', (done) => {
        spyOn(component.formAPI, 'createForm');
        component.title = '';
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
        spyOn(component.formAPI, 'createForm');
        component.title = '';
        component.makeForm(null).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Erstellen fehlgeschlagen', 'Error: template is required');
            done();
        });
    });

    /**
     * NEW FORM
     */
    it('should create new form with template', fakeAsync(() => {
        if (component.modal) {
            spyOn(component.modal, 'close').and.callThrough();
        }
        spyOn(component.formAPI, 'getForm').and.returnValue(Promise.resolve(getForm));
        component.template = '123';
        component.title = 'Test';
        fixture.detectChanges();
        component.NewForm();
        tick();
        expect(component.modal?.close).toHaveBeenCalledTimes(1);
    }));

    it('should create new form without template', () => {
        if (component.modal) {
            spyOn(component.modal, 'close').and.callThrough();
        }
        spyOn(component, 'makeForm').and.callThrough();
        component.title = 'Test';
        fixture.detectChanges();
        component.NewForm();
        expect(component.makeForm).toHaveBeenCalledTimes(1);
        expect(component.modal?.close).toHaveBeenCalledTimes(1);
    });

    it('should fail to create new form', fakeAsync(() => {
        spyOn(component.formAPI, 'getForm').and.returnValue(Promise.reject('Failed to create form'));
        component.title = 'Test';
        component.template = '123';
        fixture.detectChanges();
        component.NewForm();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
            'Failed to create form');
    }));

    it('should not create new form (missing title)', () => {
        component.title = '';
        component.NewForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Ungültige Einstellungen',
            'Bitte geben Sie einen Titel an.');
    });
    it('should create new form with template', fakeAsync(() => {
        if (component.modal) {
            spyOn(component.modal, 'close').and.callThrough();
        }
        spyOn(component.formAPI, 'getForm').and.returnValue(Promise.resolve(getForm));
        component.template = '123';
        component.title = 'Test';
        fixture.detectChanges();
        component.NewForm();
        tick();
        expect(component.modal?.close).toHaveBeenCalledTimes(1);
    }));

    it('should not create new form (missing title)', () => {
        component.title = '';
        component.NewForm();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Ungültige Einstellungen',
            'Bitte geben Sie einen Titel an.');
    });

    it('should escape input', () => {
        component.title = '<br>';
        component.escapeTitle();
        expect(component.title).toEqual('&lt;br&gt;');
    });
});

@Component({
    selector: 'power-formulars-details',
    template: ''
})
class MockDetailsComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
