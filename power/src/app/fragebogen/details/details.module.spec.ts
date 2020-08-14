import { DetailsModule } from './details.module';

describe('Fragebogen.Details.DetailsModule', () => {
    let detailsModule: DetailsModule;

    beforeEach(() => {
        detailsModule = new DetailsModule();
    });

    it('should create an instance', () => {
        expect(detailsModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
