import { AlertsModule } from './alerts.module';

describe('Shared.Alerts.AlertsModule', () => {
  let alertsModule: AlertsModule;

  beforeEach(() => {
    alertsModule = new AlertsModule();
  });

  it('should create an instance', () => {
    expect(alertsModule).toBeTruthy();
    expect(AlertsModule.forRoot()).toBeTruthy();
  });
});
