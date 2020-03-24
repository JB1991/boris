import {ImmobilienModule} from './immobilien.module';

describe('ImmobilienModule', () => {
  let immobilienModule: ImmobilienModule;

  beforeEach(() => {
    immobilienModule = new ImmobilienModule();
  });

  it('should create an instance', () => {
    expect(immobilienModule).toBeTruthy();
  });
});
