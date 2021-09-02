import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { AlertsModule } from './alerts.module';
import { AlertsService } from './alerts.service';

describe('Shared.Alerts.AlertsComponent', () => {
    let component: AlertsComponent;
    let fixture: ComponentFixture<AlertsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                AlertsService
            ],
            declarations: [
                AlertsComponent
            ],
            imports: [
                AlertsModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.alerts.alertslist).toEqual([]);
    });

    it('should close one alert', () => {
        component.alerts.NewAlert('success', 'Test Title 1', 'Test Body');
        component.alerts.NewAlert('danger', 'Test Title 2', 'Test Body', 3500);
        component.alerts.NewAlert('info', 'Test Title 3', 'Test Body', 4000);

        component.onClosed(1); // delete danger alert
        expect(component.alerts.alertslist.length).toEqual(2);
        expect(component.alerts.alertslist[0].type).toEqual('success');
        expect(component.alerts.alertslist[1].type).toEqual('info');
    });

    it('should crash', () => {
        component.alerts.NewAlert('success', 'Test Title 1', 'Test Body');

        expect(() => {
            component.onClosed(1);
        }).toThrowError('Invalid id');
        expect(() => {
            component.onClosed(-1);
        }).toThrowError('Invalid id');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
