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
