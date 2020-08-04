import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FlurstueckPipe } from '@app/bodenwert-kalkulator/flurstueck-pipe.pipe';
import { BodenwertKalkulatorComponent } from '@app/bodenwert-kalkulator/bodenwert-kalkulator/bodenwert-kalkulator.component';
import { BodenwertKalkulatorRoutingModule } from '@app/bodenwert-kalkulator/bodenwert-kalkulator-routing.module';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    FlurstueckPipe,
    BodenwertKalkulatorComponent,
  ],
  imports: [
    BodenwertKalkulatorRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgxMapboxGLModule,
    SharedModule
  ],
  exports: []
})
export class BodenwertKalkulatorModule {
}
