import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { OgcServicesComponent } from './ogc-services/ogc-services.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';

import { ModuleGuard } from '@app/module.guard';

const routes: Routes = [
    {
        path: '',
        component: StartComponent
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [ModuleGuard]
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [ModuleGuard]
    },
    {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [ModuleGuard]
    },
    {
        path: 'ogc-dienste',
        component: OgcServicesComponent,
        canActivate: [ModuleGuard]
    },
    {
        path: 'impressum',
        component: ImprintComponent
    },
    {
        path: 'datenschutz',
        component: PrivacyComponent
    },
    {
        path: 'nutzungsbedingungen',
        component: TermsOfServiceComponent
    },
    {
        path: 'barrierefreiheit',
        component: AccessibilityComponent
    },
    {
        path: 'notfound',
        component: NotfoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaticRoutingModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
