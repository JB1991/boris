import { GmbModule } from './gmb.module';

describe('Gmb.GmbModule', () => {
    let gmbModule: GmbModule;

    beforeEach(() => {
        gmbModule = new GmbModule();
    });

    it('should create an instance', () => {
        expect(gmbModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
