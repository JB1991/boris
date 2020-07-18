import { AlertsModule } from './alerts.module';

describe('Fragebogen.Shared.AlertsModule', () => {
  let alertsModule: AlertsModule;

  beforeEach(() => {
    alertsModule = new AlertsModule();
  });

  it('should create an instance', () => {
    expect(alertsModule).toBeTruthy();
  });
});
