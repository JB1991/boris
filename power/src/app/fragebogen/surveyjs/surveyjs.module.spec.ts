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
