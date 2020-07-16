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
  it('should add invalid alert', () => {
    expect(function() {
      service.NewAlert(null, '', '');
    }).toThrowError('Type is required');
    expect(function() {
      service.NewAlert('succes', 'Test Title', 'Test Body');
    }).toThrowError('Type is invalid');
  });
  it('should reset service', () => {
    service.NewAlert('success', 'Test Title', 'Test Body', 3500);
    expect(service.alertslist[0].timeout).toEqual(3500);

    // reset service
    service.resetService();
    expect(service.alertslist).toEqual([]);
  });
});
