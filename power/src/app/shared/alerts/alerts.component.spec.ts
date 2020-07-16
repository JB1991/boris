import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';

describe('Shared.Alerts.AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let storage: AlertsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storage = TestBed.inject(AlertsService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storage.alertslist).toEqual([]);
  });

  it('should close one alert', () => {
    storage.NewAlert('success', 'Test Title 1', 'Test Body');
    storage.NewAlert('danger', 'Test Title 2', 'Test Body', 3500);
    storage.NewAlert('info', 'Test Title 3', 'Test Body', 4000);

    component.onClosed(1); // delete danger alert
    expect(storage.alertslist.length).toEqual(2);
    expect(storage.alertslist[0].type).toEqual('success');
    expect(storage.alertslist[1].type).toEqual('info');
  });

  it('should crash', () => {
    storage.NewAlert('success', 'Test Title 1', 'Test Body');

    expect(function() {
      component.onClosed(1);
    }).toThrowError('Invalid id');
    expect(function() {
      component.onClosed(-1);
    }).toThrowError('Invalid id');
  });

  // reset service after each test
  afterEach(() => {
    storage.resetService();
    storage = null;
  });
});
