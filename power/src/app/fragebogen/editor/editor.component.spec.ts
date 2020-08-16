import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { environment } from '@env/environment';

import { EditorComponent } from './editor.component';
import { StorageService } from './storage.service';
import { HistoryService } from './history.service';
import { SvgPipe } from './svg.pipe';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

describe('Fragebogen.Editor.EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let httpTestingController: HttpTestingController;

    const formSample = require('../../../assets/fragebogen/form-sample.json');
    const formContent = require('../../../assets/fragebogen/form-content.json');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                NgxSmoothDnDModule,
                CollapseModule.forRoot(),
                SurveyjsModule
            ],
            providers: [
                Title,
                StorageService,
                HistoryService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => {
                                    return 'abc';
                                }
                            }
                        }
                    }
                },
                AlertsService,
                LoadingscreenService
            ],
            declarations: [
                EditorComponent,
                MockElementModalComponent,
                MockFormularModalComponent,
                SvgPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.model).toEqual(formContent);

        // expect crash
        expect(function () {
            component.loadData(null);
        }).toThrowError('id is required');
    });

    it('should create 2', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(null);
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should fail to load', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'abc');
    });

    it('should fail to load 2', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { 'error': 'xxx' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'xxx');
    });

    it('should fail to load 3', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', 5,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'Not Found');
    });

    it('should not leave page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.canDeactivate()).toBeTrue();
        spyOn(window, 'confirm').and.returnValue(true);

        environment.production = true;
        expect(component.canDeactivate()).toEqual(!component.storage.getUnsavedChanges());
        environment.production = false;
    });

    it('should canDeactivate', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.canDeactivate()).toBeTrue();
    });

    it('should onScroll/onResize', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        // small screen, not scrolled
        (<any>window).innerWidth = 450;
        component.onScroll(null);
        component.onResize(null);

        // wide screen, scrolled
        (<any>window).innerWidth = 1024;
        (<any>window).pageYOffset = 10000;
        component.onScroll(null);
        component.onResize(null);

        // wide screen, not scrolled
        (<any>window).pageYOffset = 0;
        component.onScroll(null);
    });

    it('should drag and drop', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.shouldAcceptDropPagination({ groupName: 'pagination' }, null)).toBeTrue();
        expect(component.shouldAcceptDropPagination({ groupName: 'workspace' }, null)).toBeTrue();
        expect(component.shouldAcceptDropPagination({ groupName: 'toolbox' }, null)).toBeFalse();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'pagination' }, null)).toBeFalse();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'workspace' }, null)).toBeTrue();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'toolbox' }, null)).toBeTrue();
        expect(component.getPayloadToolbox(1)).toEqual({ from: 'toolbox', index: 1 });
        expect(component.getPayloadPagination(1)).toEqual({ from: 'pagination', index: 1 });
        expect(component.getPayloadWorkspace(1)).toEqual({ from: 'workspace', index: 1 });
    });

    it('should make new element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(2);

        // add element
        component.wsNewElement('radiogroup');
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(3);

        // add copied element
        component.elementCopy = JSON.stringify({ title: 'A', name: 'x', type: 'comment' });
        component.wsNewElement('elementcopy');
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(4);
    });

    it('should crash new element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsNewElement('toast');
        }).toThrowError('type is not a known element');
        expect(() => {
            component.wsNewElement('');
        }).toThrowError('type is required');
    });

    it('should make new page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.model.pages.length).toEqual(1);
        component.wsPageCreate();
        component.wsPageCreate(0);
        expect(component.storage.model.pages.length).toEqual(3);
    });

    it('should crash new page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsPageCreate(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageCreate(2);
        }).toThrowError('page is invalid');
    });

    it('should delete page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        spyOn(window, 'confirm').and.returnValue(true);
        component.wsPageCreate();

        // delete new page
        component.storage.selectedPageID = 0;
        component.wsPageDelete(1);
        expect(component.storage.model.pages.length).toEqual(1);
        expect(component.storage.model.pages[0].elements.length).toEqual(2);

        // delete last page
        component.storage.selectedPageID = 3;
        component.wsPageDelete(0);
        expect(component.storage.selectedPageID).toEqual(0);
        expect(component.storage.model.pages.length).toEqual(1);
        expect(component.storage.model.pages[0].elements.length).toEqual(0);
    });

    it('should not delete page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        spyOn(window, 'confirm').and.returnValue(false);
        component.wsPageCreate();
        component.wsPageDelete(1);
        expect(component.storage.model.pages.length).toEqual(2);
    });

    it('should crash delete page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsPageDelete(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageDelete(1);
        }).toThrowError('page is invalid');
    });

    it('should change page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.selectedPageID).toEqual(0);
        component.wsPageCreate();
        component.wsPageSelect(1);
        expect(component.storage.selectedPageID).toEqual(1);

        // select page
        component.wsPageSelect(0);
        expect(component.storage.selectedPageID).toEqual(0);
    });

    it('should crash change page', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsPageSelect(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageSelect(1);
        }).toThrowError('page is invalid');
    });

    it('should copy element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.wsNewElement('text');
        component.wsElementCopy(0, 0);
        expect(component.elementCopy).toEqual('{"title":"Titel der Frage","name":"e3","type":"text","valueName":"","inputType":"text","isRequired":true}');
        component.wsElementCopy(0);
        expect(component.elementCopy).toEqual('{"title":"Titel der Frage","name":"e3","type":"text","valueName":"","inputType":"text","isRequired":true}');
    });

    it('should crash copy element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsElementCopy(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementCopy(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementCopy(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.wsElementCopy(2);
        }).toThrowError('element is invalid');
    });

    it('should remove element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        spyOn(window, 'confirm').and.returnValue(true);
        expect(component.storage.model.pages[0].elements.length).toEqual(2);

        // delete element
        component.wsElementRemove(0);
        expect(component.storage.model.pages[0].elements.length).toEqual(1);
    });

    it('should not remove element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        spyOn(window, 'confirm').and.returnValue(false);
        expect(component.storage.model.pages[0].elements.length).toEqual(2);

        // delete element
        component.wsElementRemove(0, 0);
        expect(component.storage.model.pages[0].elements.length).toEqual(2);
    });

    it('should crash remove element', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsElementRemove(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementRemove(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementRemove(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.wsElementRemove(2);
        }).toThrowError('element is invalid');
    });

    it('should save formular', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.storage.setUnsavedChanges(true);
        component.wsSave();

        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'POST', formSample);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich', '');
    });

    it('should save formular error', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.storage.setUnsavedChanges(true);
        component.wsSave();

        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'POST', { 'error': 'Internal Server Error' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Internal Server Error');
    });

    it('should save formular error 2', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.storage.setUnsavedChanges(true);
        component.wsSave();

        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'POST', null);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'abc');
    });

    it('should save formular error 3', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.storage.setUnsavedChanges(true);
        component.wsSave();

        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'POST', formSample,
            { status: 404, statusText: 'Not Found' });
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Not Found');
    });

    it('should not save formular', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        // no changes
        component.storage.setAutoSaveEnabled(true);
        component.storage.setUnsavedChanges(false);
        component.wsSave();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);

        // autosave disabled
        component.storage.setAutoSaveEnabled(false);
        component.storage.setUnsavedChanges(true);
        component.wsSave();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    });

    it('should move element up', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.wsNewElement('comment');
        component.wsElementMoveup(1);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('text');

        // cant move up
        component.wsElementMoveup(0);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('text');
    });

    it('should crash move element up', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsElementMoveup(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMoveup(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMoveup(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.wsElementMoveup(2);
        }).toThrowError('element is invalid');
    });

    it('should move element down', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        component.wsNewElement('comment');
        component.wsElementMovedown(0);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('text');

        // cant move down
        component.wsElementMovedown(2);
        expect(component.storage.model.pages[0].elements[2].type).toEqual('checkbox');
    });

    it('should crash move element down', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        expect(() => {
            component.wsElementMovedown(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMovedown(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMovedown(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.wsElementMovedown(2);
        }).toThrowError('element is invalid');
    });

    it('should drag and drop workspace', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.model.pages[0].elements.length).toEqual(2);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('text');

        // do nothing
        component.onDropWorkspace({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadPagination(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(2);

        // drag new element into workspace
        component.onDropWorkspace({ removedIndex: 0, addedIndex: 1, payload: component.getPayloadToolbox(1) });
        expect(component.storage.model.pages[0].elements[1].type).toEqual('comment');
        expect(component.storage.model.pages[0].elements.length).toEqual(3);

        // drag element 1 onto position 0
        component.onDropWorkspace({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadWorkspace(1) });
        expect(component.storage.model.pages[0].elements[0].type).toEqual('comment');
        expect(component.storage.model.pages[0].elements[1].type).toEqual('text');

        // drag copied element into workspace
        component.elementCopy = JSON.stringify({ title: 'A', name: 'x', type: 'imagepicker' });
        component.onDropWorkspace({ removedIndex: 10, addedIndex: 0, payload: component.getPayloadToolbox(99) });
        expect(component.storage.model.pages[0].elements[0].type).toEqual('imagepicker');
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
    });

    it('should drag and drop pagination', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });
        expect(component.storage.model.pages[0].elements.length).toEqual(2);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('text');

        // do nothing
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadToolbox(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(2);
        expect(component.storage.model.pages.length).toEqual(1);

        // drag page 1 onto position 0
        component.wsPageCreate();
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadPagination(1) });
        expect(component.storage.model.pages[0].elements.length).toEqual(0);
        expect(component.storage.model.pages[1].elements.length).toEqual(2);

        // drag element into other page
        component.storage.selectedPageID = 1;
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadWorkspace(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(1);
        expect(component.storage.model.pages[1].elements.length).toEqual(1);

        // drag element into same page as its from
        component.onDropPagination({ removedIndex: 1, addedIndex: 2, payload: component.getPayloadWorkspace(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(1);
        expect(component.storage.model.pages[1].elements.length).toEqual(1);
    });

    it('should not drag and drop', () => {
        answerHTTPRequest(environment.formAPI + 'intern/forms/abc', 'GET', { data: { content: formContent } });

        component.onDropPagination(null);
        component.onDropPagination({ removedIndex: null, addedIndex: null });
        component.onDropPagination({ removedIndex: 0, addedIndex: 0 });

        component.onDropWorkspace(null);
        component.onDropWorkspace({ removedIndex: null, addedIndex: null });
        component.onDropWorkspace({ removedIndex: 0, addedIndex: 0 });

        expect(component.storage.model.pages[0].elements.length).toEqual(2);
        expect(() => {
            component.onDropWorkspace({ removedIndex: 10, addedIndex: 0, payload: component.getPayloadToolbox(99) });
        }).toThrowError('Could not create new Element');
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    function answerHTTPRequest(url, method, body, opts?) {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    }

    function deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();
    });
});

@Component({
    selector: 'power-formulars-editor-modal-element',
    template: ''
})
class MockElementModalComponent {
}
@Component({
    selector: 'power-forms-editor-formular-settings',
    template: ''
})
class MockFormularModalComponent {
}
