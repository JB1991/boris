import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { StorageService } from './storage.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NewformComponent } from './newform/newform.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NewformComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  providers: [
    StorageService
  ]
})
export class DashboardModule { }
