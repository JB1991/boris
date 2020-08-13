import { DashboardModule } from './dashboard.module';

describe('Fragebogen.Dashboard.DashboardModule', () => {
    let dashboardModule: DashboardModule;

    beforeEach(() => {
        dashboardModule = new DashboardModule();
    });

    it('should create an instance', () => {
        expect(dashboardModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
