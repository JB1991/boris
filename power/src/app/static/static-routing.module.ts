import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from './start/start.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { OgcServicesComponent } from './ogc-services/ogc-services.component';

import { ModuleGuard } from '@app/module.guard';

const routes: Routes = [
    {
        path: '',
        component: StartComponent
    },
    {
        path: 'impressum',
        component: ImpressumComponent,
        canActivate: [ModuleGuard]
    },
    {
        path: 'datenschutz',
        component: DatenschutzComponent,
        canActivate: [ModuleGuard]
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
        path: 'ogc-services',
        component: OgcServicesComponent,
        canActivate: [ModuleGuard]
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
