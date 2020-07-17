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
