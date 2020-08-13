import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { StartComponent } from './start/start.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
    imports: [
        StaticRoutingModule,
        CommonModule
    ],
    declarations: [
        StartComponent,
        ImpressumComponent,
        DatenschutzComponent,
        LoginComponent,
        LogoutComponent,
        FeedbackComponent
    ]
})
export class StaticModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
