import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilloutRoutingModule } from './fillout-routing.module';
import { FilloutComponent } from './fillout.component';
import { AlertsModule } from '../alerts/alerts.module';
import { LoadingscreenModule } from '../loadingscreen/loadingscreen.module';

@NgModule({
  declarations: [
    FilloutComponent,
  ],
  imports: [
    CommonModule,
    FilloutRoutingModule,
    AlertsModule,
    LoadingscreenModule
  ]
})
export class FilloutModule { }
