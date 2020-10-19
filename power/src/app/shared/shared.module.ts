import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { A11yModule } from '@angular/cdk/a11y';

import { GeosearchComponent } from './geosearch/geosearch.component';
import { ModalComponent } from './modal/modal.component';
import { ModalminiComponent } from './modalmini/modalmini.component';
import { TagboxComponent } from './tagbox/tagbox.component';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { LoadingscreenModule } from './loadingscreen/loadingscreen.module';
import { SvgPipe } from './pipes/svg.pipe';
import { HyphenatePipe } from './pipes/hyphenate.pipe';

@NgModule({
    declarations: [
        GeosearchComponent,
        ModalComponent,
        ModalminiComponent,
        TagboxComponent,
        SvgPipe,
        HyphenatePipe
    ],
    exports: [
        GeosearchComponent,
        ModalComponent,
        ModalminiComponent,
        TagboxComponent,
        AuthModule,
        AlertsModule,
        LoadingscreenModule,
        SvgPipe,
        HyphenatePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbTypeaheadModule,
        ModalModule.forRoot(),
        A11yModule
    ]
})
export class SharedModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
