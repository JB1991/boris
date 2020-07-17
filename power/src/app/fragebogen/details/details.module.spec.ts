import { DetailsModule } from './details.module';

describe('Fragebogen.Details.DetailsModule', () => {
  let detailsModule: DetailsModule;

  beforeEach(() => {
    detailsModule = new DetailsModule();
  });

  it('should create an instance', () => {
    expect(detailsModule).toBeTruthy();
  });
});
