import { PublicDashboardModule } from './public-dashboard.module';

describe('Fragebogen.PublicDashboard.PublicDashboardModule', () => {
    let publicDashboardModule: PublicDashboardModule;

    beforeEach(() => {
        publicDashboardModule = new PublicDashboardModule();
    });

    it('should create an instance', () => {
        expect(publicDashboardModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
