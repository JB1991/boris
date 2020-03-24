import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule, AlertModule } from 'ngx-bootstrap';

import { FragebogenComponent } from './fragebogen.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';

import { AlertsService } from './alerts/alerts.service';
import { LoadingscreenService } from './loadingscreen/loadingscreen.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { FormularModule } from './formular/formular.module';
import { EditorModule } from './editor/editor.module';
import {FragebogenRoutingModule} from '@app/fragebogen/fragebogen-routing.module';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    FragebogenComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AlertsComponent,
    LoadingscreenComponent,
  ],
  imports: [
    FragebogenRoutingModule,
    CommonModule,
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
  ],
  bootstrap: [FragebogenComponent]
})
export class FragebogenModule {
  constructor() {
  }
}
