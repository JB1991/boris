import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FlurstueckPipe } from './flurstueck-pipe.pipe';
import { BodenwertKalkulatorComponent } from './bodenwert-kalkulator/bodenwert-kalkulator.component';
import { BodenwertKalkulatorRoutingModule } from './bodenwert-kalkulator-routing.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
    declarations: [
        BodenwertKalkulatorComponent,
        FlurstueckPipe,
    ],
    imports: [
        BodenwertKalkulatorRoutingModule,
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot()
    ],
    exports: []
})
export class BodenwertKalkulatorModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
