import {ImmobilienModule} from './immobilien.module';

describe('Immobilien.ImmobilienModule', () => {
    let immobilienModule: ImmobilienModule;

    beforeEach(() => {
        immobilienModule = new ImmobilienModule();
    });

    it('should create an instance', () => {
        expect(immobilienModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
