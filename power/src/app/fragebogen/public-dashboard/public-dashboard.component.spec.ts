import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicDashboardComponent } from './public-dashboard.component';

describe('Fragebogen.PublicDashboard.DashboardComponent', () => {
    let component: PublicDashboardComponent;
    let fixture: ComponentFixture<PublicDashboardComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const publicFormsListSample = require('../../../assets/fragebogen/public-forms-list-sample.json');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ])
            ],
            providers: [
                Title,
                StorageService,
                AlertsService,
                LoadingscreenService
            ],
            declarations: [
                PublicDashboardComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PublicDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create 1', () => {
        answerHTTPRequest(environment.formAPI + 'public/forms?fields=id,title,published', 'GET', publicFormsListSample);
        expect(component.storage.formsList.length).toBeGreaterThan(0);
    });

    it('should fail 1', () => {
        answerHTTPRequest(environment.formAPI + 'public/forms?fields=id,title,published', 'GET', null);
        expect(component.storage.formsList.length).toBe(0);
    });

    it('should fail 2', () => {
        answerHTTPRequest(environment.formAPI + 'public/forms?fields=id,title,published', 'GET', {'error': 'failed'});
        expect(component.storage.formsList.length).toBe(0);
    });

    it('should fail 3', () => {
        answerHTTPRequest(environment.formAPI + 'public/forms?fields=id,title,published',
            'GET', {}, { status: 404, statusText: 'Not Found' });
        expect(component.storage.formsList.length).toBe(0);
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
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
