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
