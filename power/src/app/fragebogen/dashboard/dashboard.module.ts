import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AlertsModule } from '../alerts/alerts.module';
import { LoadingscreenModule } from '../loadingscreen/loadingscreen.module';
import { StorageService } from './storage.service';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AlertsModule,
    LoadingscreenModule
  ],
  providers: [
    StorageService
  ]
})
export class DashboardModule { }
