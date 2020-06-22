import {NgModule} from '@angular/core';

import {BodenrichtwertRoutingModule} from './bodenrichtwert-routing.module';
import {BodenrichtwertComponent} from './bodenrichtwert.component';
import {BodenrichtwertVerlaufComponent} from './bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import {BodenrichtwertKarteComponent} from './bodenrichtwert-karte/bodenrichtwert-karte.component';
import {SharedModule} from '../shared/shared.module';
import {BodenrichtwertListeComponent} from './bodenrichtwert-liste/bodenrichtwert-liste.component';
import {BodenrichtwertService} from './bodenrichtwert.service';

import {BodenrichtwertDetailComponent} from './bodenrichtwert-detail/bodenrichtwert-detail.component';
import {AngularResizedEventModule} from 'angular-resize-event';

import {NgxMapboxGLModule} from 'ngx-mapbox-gl';

import {NgxEchartsModule} from 'ngx-echarts';
import { NutzungPipe } from './util/nutzung.pipe';
import { BeitragPipe } from './util/beitrag.pipe';

@NgModule({
  declarations: [
    BodenrichtwertKarteComponent,
    BodenrichtwertComponent,
    BodenrichtwertDetailComponent,
    BodenrichtwertVerlaufComponent,
    BodenrichtwertListeComponent,
    NutzungPipe,
    BeitragPipe
  ],
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    NgxEchartsModule,
    AngularResizedEventModule,
    BodenrichtwertRoutingModule,
  ],
  providers: [BodenrichtwertService, NutzungPipe]
})
export class BodenrichtwertModule {
}
