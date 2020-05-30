import { Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { FragebogenRoutingModule } from './fragebogen-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { EditorModule } from './editor/editor.module';
import { DetailsModule } from './details/details.module';
import { FilloutModule } from './fillout/fillout.module';

import { AlertsModule } from '@app/shared/alerts/alerts.module';
import { LoadingscreenModule } from '@app/shared/loadingscreen/loadingscreen.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    FragebogenRoutingModule,
    HttpClientModule,
    FormsModule,
    CollapseModule.forRoot(),
    DashboardModule,
    EditorModule,
    DetailsModule,
    FilloutModule,
    AlertsModule,
    LoadingscreenModule
  ],
  providers: [
    Title,
  ]
})

export class FragebogenModule {
  constructor() {
  }
}
