import { Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';

import { FragebogenRoutingModule } from './fragebogen-routing.module';
import { AlertsService } from './alerts/alerts.service';
import { LoadingscreenService } from './loadingscreen/loadingscreen.service';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { EditorModule } from './editor/editor.module';
import { DetailsModule } from './details/details.module';
import { FilloutModule } from './fillout/fillout.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    FragebogenRoutingModule,
    HttpClientModule,
    FormsModule,
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    DashboardModule,
    EditorModule,
    DetailsModule,
    FilloutModule,
  ],
  providers: [
    Title,
    AlertsService,
    LoadingscreenService,
  ]
})

export class FragebogenModule {
  constructor() {
  }
}
