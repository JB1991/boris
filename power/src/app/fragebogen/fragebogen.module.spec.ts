import { FragebogenModule } from './fragebogen.module';

describe('Fragebogen.FragebogenModule', () => {
    let fragebogenModule: FragebogenModule;

    beforeEach(() => {
        fragebogenModule = new FragebogenModule();
    });

    it('should create an instance', () => {
        expect(fragebogenModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
