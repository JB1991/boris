import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { StorageService } from './storage.service';
import { DashboardComponent } from './dashboard.component';
import { NewformComponent } from './newform/newform.component';

import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [
        DashboardComponent,
        NewformComponent,
    ],
    imports: [
        DashboardRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot(),
        SharedModule
    ],
    providers: [
        StorageService
    ]
})
export class DashboardModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
