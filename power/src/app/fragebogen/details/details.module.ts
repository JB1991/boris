import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { AlertsModule } from '../alerts/alerts.module';
import { LoadingscreenModule } from '../loadingscreen/loadingscreen.module';

@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    AlertsModule,
    LoadingscreenModule
  ]
})
export class DetailsModule { }
