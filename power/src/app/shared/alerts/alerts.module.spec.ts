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
/* vim: set expandtab ts=4 sw=4 sts=4: */
