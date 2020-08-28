import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PublicDashboardRoutingModule } from './public-dashboard-routing.module';
import { PublicDashboardComponent } from './public-dashboard.component';
import { StorageService } from './storage.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PublicDashboardComponent
    ],
    imports: [
        CommonModule,
        PublicDashboardRoutingModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot()
    ],
    providers: [
        StorageService
    ]
})
export class PublicDashboardModule { }
