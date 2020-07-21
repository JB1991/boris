import { AuthModule } from './auth.module';

describe('Shared.Auth.AuthModule', () => {
  let authModule: AuthModule;

  beforeEach(() => {
    authModule = new AuthModule();
  });

  it('should create an instance', () => {
    expect(authModule).toBeTruthy();
    expect(AuthModule.forRoot()).toBeTruthy();
  });
});
