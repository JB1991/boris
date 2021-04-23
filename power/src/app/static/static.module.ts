import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { StaticRoutingModule } from './static-routing.module';
import { StartComponent } from './start/start.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotfoundComponent } from './notfound/notfound.component';
import { OgcServicesComponent } from './ogc-services/ogc-services.component';

@NgModule({
    imports: [
        StaticRoutingModule,
        CommonModule,
        FormsModule,
        SharedModule,
        CarouselModule.forRoot(),
        AccordionModule.forRoot()
    ],
    declarations: [
        StartComponent,
        ImpressumComponent,
        DatenschutzComponent,
        LoginComponent,
        LogoutComponent,
        FeedbackComponent,
        NotfoundComponent,
        OgcServicesComponent
    ]
})
export class StaticModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
