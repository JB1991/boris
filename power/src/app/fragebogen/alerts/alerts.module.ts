import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';

import { AlertsComponent } from '@app/fragebogen/alerts/alerts.component';
import { AlertsService } from '@app/fragebogen/alerts/alerts.service';

@NgModule({
  declarations: [
    AlertsComponent
  ],
  imports: [
    CommonModule,
    AlertModule,
  ],
  providers: [
    AlertsService
  ],
  exports: [
    AlertsComponent
  ]
})
export class AlertsModule { }
