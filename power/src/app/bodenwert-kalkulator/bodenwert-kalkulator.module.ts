import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {FlurstueckPipe} from '@app/bodenwert-kalkulator/flurstueck-pipe.pipe';
import {BodenwertKalkulatorComponent} from '@app/bodenwert-kalkulator/bodenwert-kalkulator/bodenwert-kalkulator.component';
import {BodenwertKalkulatorRoutingModule} from '@app/bodenwert-kalkulator/bodenwert-kalkulator-routing.module';

import {NgxMapboxGLModule} from 'ngx-mapbox-gl';

@NgModule({
  declarations: [
    FlurstueckPipe,
    BodenwertKalkulatorComponent,
  ],
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    BodenwertKalkulatorRoutingModule,
  ],
  exports: []
})
export class BodenwertKalkulatorModule {
}
