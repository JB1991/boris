import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicDashboardComponent } from './public-dashboard.component';
import { FormAPIService } from '../formapi.service';
import { environment } from '@env/environment';

describe('Fragebogen.PublicDashboard.DashboardComponent', () => {
    let component: PublicDashboardComponent;
    let fixture: ComponentFixture<PublicDashboardComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const publicForms = require('../../../assets/fragebogen/public-get-forms.json');
    const publicFormsBig = require('../../../assets/fragebogen/public-get-forms-big.json');

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
                FormAPIService,
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

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    /*
        SUCCESS
    */
    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.returnValue(Promise.resolve(publicForms));
        component.filterByTitle('something');
        component.changePage(1);
        component.changePerPage(1);
        component.changeSort('title');
        component.update().then(() => {
            done();
            expect(component.data).toBe(publicForms.data);
            expect(component.total).toBe(publicForms.total);
            expect(component.title).toBe('something');
        });
    });

    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.returnValue(Promise.resolve(publicFormsBig));
        component.filterByTitle('something');
        component.changePage(0);
        component.changePerPage(10);
        component.changeSort('published');
        component.update().then(() => {
            done();
            expect(component.data).toBe(publicFormsBig.data);
            expect(component.total).toBe(publicFormsBig.total);
            expect(component.perPage).toBe(10);
        });
    });

    /*
        Error
    */
    it('should fail', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.throwError('fail');
        component.filterByTitle('something');
        component.update().then(() => {
            done();
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
        });
    });
});

@Component({
    selector: 'power-forms-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
