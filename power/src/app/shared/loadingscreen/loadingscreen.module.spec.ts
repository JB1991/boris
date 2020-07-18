import { LoadingscreenModule } from './loadingscreen.module';

describe('Fragebogen.Shared.LoadingscreenModule', () => {
  let loadingscreenModule: LoadingscreenModule;

  beforeEach(() => {
    loadingscreenModule = new LoadingscreenModule();
  });

  it('should create an instance', () => {
    expect(loadingscreenModule).toBeTruthy();
  });
});
