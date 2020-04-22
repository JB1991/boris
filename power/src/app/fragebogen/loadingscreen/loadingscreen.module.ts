import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingscreenComponent } from './loadingscreen.component';
import { LoadingscreenService } from './loadingscreen.service';

@NgModule({
  declarations: [
    LoadingscreenComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    LoadingscreenService
  ],
  exports: [
    LoadingscreenComponent
  ]
})
export class LoadingscreenModule { }
