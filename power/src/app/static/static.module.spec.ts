import { StaticModule } from './static.module';

describe('Static.StaticModule', () => {
    let staticModule: StaticModule;

    beforeEach(() => {
        staticModule = new StaticModule();
    });

    it('should create an instance', () => {
        expect(staticModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
