import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PublicDashboardRoutingModule } from './public-dashboard-routing.module';
import { PublicDashboardComponent } from './public-dashboard.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
    declarations: [
        PublicDashboardComponent
    ],
    imports: [
        CommonModule,
        PublicDashboardRoutingModule,
        HttpClientModule,
        FormsModule,
        PaginationModule.forRoot()
    ],
    providers: []
})
export class PublicDashboardModule { }
