import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { GeosearchComponent } from './geosearch/geosearch.component';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { LoadingscreenModule } from './loadingscreen/loadingscreen.module';

@NgModule({
  declarations: [
    GeosearchComponent
  ],
  exports: [
    GeosearchComponent,
    AuthModule,
    AlertsModule,
    LoadingscreenModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule
  ]
})
export class SharedModule {
}
