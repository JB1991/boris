import { NgModule } from '@angular/core';

import { BodenrichtwertRoutingModule } from './bodenrichtwert-routing.module';
import { BodenrichtwertComponent } from './bodenrichtwert-component/bodenrichtwert.component';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte/bodenrichtwert-karte.component';
import { SharedModule } from '../shared/shared.module';
import { BodenrichtwertListeComponent } from './bodenrichtwert-liste/bodenrichtwert-liste.component';
import { BodenrichtwertService } from './bodenrichtwert.service';

import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail/bodenrichtwert-detail.component';
import { AngularResizedEventModule } from 'angular-resize-event';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { NgxEchartsModule } from 'ngx-echarts';
import { NutzungPipe } from './pipes/nutzung.pipe';
import { BeitragPipe } from './pipes/beitrag.pipe';
import { HyphenatePipe } from './pipes/hyphenate.pipe';

/**
 * This module provides user interface for Bodenrichtwerte.
 * Therefore it contains:
 * (1) Bodenrichtwert-Detail
 * (2) Bodenrichtwert-Karte
 * (3) Bodenrichtwert-Liste
 * (4) Bodenrichtwert-Verlauf
 * All subcomponents are arranged in Bodenrichtwert-Component
 * All data is loaded via Bodenrichtwert-Service.
 */
@NgModule({
  declarations: [
    BodenrichtwertKarteComponent,
    BodenrichtwertComponent,
    BodenrichtwertDetailComponent,
    BodenrichtwertVerlaufComponent,
    BodenrichtwertListeComponent,
    NutzungPipe,
    BeitragPipe,
    HyphenatePipe
  ],
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    NgxEchartsModule,
    AngularResizedEventModule,
    BodenrichtwertRoutingModule,
  ],
  providers: [BodenrichtwertService]
})
export class BodenrichtwertModule {
}
