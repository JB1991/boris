import { LoadingscreenModule } from './loadingscreen.module';

describe('Shared.Loadingscreen.LoadingscreenModule', () => {
  let loadingscreenModule: LoadingscreenModule;

  beforeEach(() => {
    loadingscreenModule = new LoadingscreenModule();
  });

  it('should create an instance', () => {
    expect(loadingscreenModule).toBeTruthy();
    expect(LoadingscreenModule.forRoot()).toBeTruthy();
  });
});
