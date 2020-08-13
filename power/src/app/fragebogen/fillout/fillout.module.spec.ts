import { FilloutModule } from './fillout.module';

describe('Fragebogen.Fillout.FilloutModule', () => {
    let filloutModule: FilloutModule;

    beforeEach(() => {
        filloutModule = new FilloutModule();
    });

    it('should create an instance', () => {
        expect(filloutModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
