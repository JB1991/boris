import { TestBed } from '@angular/core/testing';

import { AlertsService } from './alerts.service';

describe('Shared.Alerts.AlertsService', () => {
    let service: AlertsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AlertsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.alertslist).toEqual([]);
    });

    it('should add new alert', () => {
        service.NewAlert('success', 'Test Title', 'Test Body');
        expect(service.alertslist.length).toEqual(1);
        expect(service.alertslist[0].timeout).toEqual(5000);
        expect(service.alertslist[0].title).toEqual('Test Title');
    });

    it('should prevent too much alerts', () => {
        service.NewAlert('success', 'Test Title', 'Test Body');
        service.NewAlert('success', 'Test Title', 'Test Body');
        service.NewAlert('success', 'Test Title', 'Test Body');
        service.NewAlert('success', 'Test Title', 'Test Body');
        expect(service.alertslist.length).toEqual(4);
        service.NewAlert('success', 'Test Title', 'Test Body');
        expect(service.alertslist.length).toEqual(4);
    });

    it('should prevent too big timeout', () => {
        expect(() => {
            service.NewAlert('success', 'Test Title', 'Test Body', 120000);
        }).toThrowError('timeout too big or small');
    });

    it('should reset service', () => {
        service.NewAlert('success', 'Test Title', 'Test Body', 3500);
        expect(service.alertslist[0].timeout).toEqual(3500);

        // reset service
        service.resetService();
        expect(service.alertslist).toEqual([]);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
