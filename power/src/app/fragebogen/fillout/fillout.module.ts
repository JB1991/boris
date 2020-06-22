import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilloutRoutingModule } from './fillout-routing.module';
import { FilloutComponent } from './fillout.component';
import { StorageService } from './storage.service';
import { SurveyjsModule } from '../surveyjs/surveyjs.module';

@NgModule({
  declarations: [
    FilloutComponent,
  ],
  imports: [
    CommonModule,
    FilloutRoutingModule,
    SurveyjsModule
  ],
  providers: [
    StorageService
  ]
})
export class FilloutModule { }
