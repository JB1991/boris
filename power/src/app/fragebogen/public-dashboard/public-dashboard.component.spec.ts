import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicDashboardComponent } from './public-dashboard.component';
import { FormAPIService } from '../formapi.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';

describe('Fragebogen.PublicDashboard.DashboardComponent', () => {
    let component: PublicDashboardComponent;
    let fixture: ComponentFixture<PublicDashboardComponent>;

    const getPublicForms = require('../../../testdata/fragebogen/get-public-forms.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: 'forms', component: MockHomeComponent }
                ]),
                PaginationModule.forRoot()
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

        spyOn(console, 'error');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges();
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    /*
        SUCCESS
    */
    it('should succeed', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.returnValue(Promise.resolve(getPublicForms));

        /* eslint-disable-next-line scanjs-rules/assign_to_search */
        component.search = 'something';
        component.sort = 'id';
        component.update(false).then(() => {
            expect(component.data).toBe(getPublicForms.forms);
            expect(component.total).toBe(getPublicForms.total);
            done();
        });
    });

    it('should succeed 2', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.returnValue(Promise.resolve({
            forms: [],
            total: 100,
            status: 200,
        }));
        /* eslint-disable-next-line scanjs-rules/assign_to_search */
        component.search = 'something';
        component.update(false).then(() => {
            expect(component.pageSizes.length).toBe(10);
            done();
        });
    });

    it('should changeSort', () => {
        spyOn(component, 'update');
        component.sort = 'content';
        component.desc = true;

        component.changeFormSort('extract');
        expect(component.sort).toBe('extract');
        expect(component.desc).toBe(false);

        component.changeFormSort('extract');
        expect(component.sort).toBe('extract');
        expect(component.desc).toBe(true);

        expect(component.update).toHaveBeenCalledTimes(2);
    });

    /*
        Error
    */
    it('should fail', (done) => {
        spyOn(component.formAPI, 'getPublicForms').and.returnValue(Promise.reject('fail'));
        component.update(true).then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert)
                .toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen', 'fail');
            done();
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
