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
/* vim: set expandtab ts=4 sw=4 sts=4: */
