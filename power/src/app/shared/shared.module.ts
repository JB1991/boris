import {NgModule} from '@angular/core';
import {GeosearchComponent} from './geosearch/geosearch.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbCollapseModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { AlertsModule } from '@app/shared/alerts/alerts.module';
import { LoadingscreenModule } from '@app/shared/loadingscreen/loadingscreen.module';
import { AuthModule } from '@app/shared/auth/auth.module';

@NgModule({
  declarations: [GeosearchComponent],
  exports: [
    NgbModule,
    FormsModule,
    HttpClientModule,
    GeosearchComponent,
    NgbAccordionModule,
    NgbCollapseModule,
    CommonModule,
    AlertsModule,
    LoadingscreenModule,
    AuthModule
  ],
  imports: [
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [HttpClientModule]
})
export class SharedModule {
}
