import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { A11yModule } from '@angular/cdk/a11y';

import { GeosearchComponent } from './geosearch/geosearch.component';
import { ModalComponent } from './modal/modal.component';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { LoadingscreenModule } from './loadingscreen/loadingscreen.module';

@NgModule({
    declarations: [
        GeosearchComponent,
        ModalComponent
    ],
    exports: [
        GeosearchComponent,
        ModalComponent,
        AuthModule,
        AlertsModule,
        LoadingscreenModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbTypeaheadModule,
        A11yModule
    ]
})
export class SharedModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
