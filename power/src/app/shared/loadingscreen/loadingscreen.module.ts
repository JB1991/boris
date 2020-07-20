import { NgModule, ModuleWithProviders } from '@angular/core';
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
  exports: [
    LoadingscreenComponent
  ]
})
export class LoadingscreenModule {
  static forRoot(): ModuleWithProviders<LoadingscreenModule> {
    return {
        ngModule: LoadingscreenModule,
        providers: [LoadingscreenService]
    };
  }
}
