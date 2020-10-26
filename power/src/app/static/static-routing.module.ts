import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { ImpressumComponent } from '@app/static/impressum/impressum.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FeedbackComponent } from '@app/static/feedback/feedback.component';

import { ModuleGuard } from '../module.guard';

const routes: Routes = [
    {
        path: '',
        component: StartComponent
    },
    {
        path: 'impressum',
        component: ImpressumComponent
    },
    {
        path: 'datenschutz',
        component: DatenschutzComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [ModuleGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaticRoutingModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
