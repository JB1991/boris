import { SurveyjsModule } from './surveyjs.module';

describe('Fragebogen.Surveyjs.SurveyjsModule', () => {
    let surveyjsModule: SurveyjsModule;

    beforeEach(() => {
        surveyjsModule = new SurveyjsModule();
    });

    it('should create an instance', () => {
        expect(surveyjsModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
