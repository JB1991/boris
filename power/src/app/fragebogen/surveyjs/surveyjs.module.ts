import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowdownModule } from 'ngx-showdown';

import { WrapperComponent } from './wrapper.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewPipe } from './preview.pipe';

@NgModule({
  declarations: [
    WrapperComponent,
    PreviewComponent,
    PreviewPipe
  ],
  imports: [
    CommonModule,
    ShowdownModule
  ],
  exports: [
    WrapperComponent,
    PreviewComponent,
    PreviewPipe
  ]
})
export class SurveyjsModule { }
