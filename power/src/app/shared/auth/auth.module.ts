import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        AuthGuard
    ]
})
export class AuthModule {
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [AuthService, AuthGuard]
        };
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
