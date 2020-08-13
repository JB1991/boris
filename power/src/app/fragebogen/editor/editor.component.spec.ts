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
                MockFormularModalComponent
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
    selector: 'power-formulars-editor-modal-formular',
    template: ''
})
class MockFormularModalComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
