import { Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';

import { FragebogenRoutingModule } from './fragebogen-routing.module';
import { AlertsComponent } from './alerts/alerts.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';

import { AlertsService } from './alerts/alerts.service';
import { LoadingscreenService } from './loadingscreen/loadingscreen.service';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FormularModule } from './formular/formular.module';
import { EditorModule } from './editor/editor.module';

@NgModule({
  declarations: [
    HomeComponent,
    AlertsComponent,
    LoadingscreenComponent,
  ],
  imports: [
    FragebogenRoutingModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    DashboardModule,
    FormularModule,
    EditorModule,
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
