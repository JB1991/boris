import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';

import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';

@NgModule({
  declarations: [
    AlertsComponent
  ],
  imports: [
    CommonModule,
    AlertModule.forRoot()
  ],
  exports: [
    AlertsComponent
  ]
})
export class AlertsModule {
  static forRoot(): ModuleWithProviders<AlertsModule> {
    return {
        ngModule: AlertsModule,
        providers: [AlertsService]
    };
  }
}
