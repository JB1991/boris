import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { FragebogenRoutingModule } from './fragebogen-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { EditorModule } from './editor/editor.module';
import { DetailsModule } from './details/details.module';
import { FilloutModule } from './fillout/fillout.module';

import { AuthModule } from '@app/shared/auth/auth.module';
import { AlertsModule } from '@app/shared/alerts/alerts.module';
import { LoadingscreenModule } from '@app/shared/loadingscreen/loadingscreen.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    FragebogenRoutingModule,
    CommonModule,
    FormsModule,
    DashboardModule,
    DetailsModule,
    FilloutModule,
    EditorModule,
    AuthModule,
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
