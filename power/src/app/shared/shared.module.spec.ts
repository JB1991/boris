import { SharedModule } from './shared.module';

describe('Shared.SharedModule', () => {
    let sharedModule: SharedModule;

    beforeEach(() => {
        sharedModule = new SharedModule();
    });

    it('should create an instance', () => {
        expect(sharedModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
