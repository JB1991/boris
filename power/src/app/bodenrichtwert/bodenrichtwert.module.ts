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


@NgModule({
  declarations: [
    BodenrichtwertKarteComponent,
    BodenrichtwertComponent,
    BodenrichtwertDetailComponent,
    BodenrichtwertVerlaufComponent,
    BodenrichtwertListeComponent,
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
