import { BodenrichtwertModule } from './bodenrichtwert.module';

describe('Bodenrichtwert.BodenrichtwertModule', () => {
    let bodenrichtwertModule: BodenrichtwertModule;

    beforeEach(() => {
        bodenrichtwertModule = new BodenrichtwertModule();
    });

    it('should create an instance', () => {
        expect(bodenrichtwertModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
