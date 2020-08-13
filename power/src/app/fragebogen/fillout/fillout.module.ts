import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilloutRoutingModule } from './fillout-routing.module';
import { FilloutComponent } from './fillout.component';
import { StorageService } from './storage.service';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

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
/* vim: set expandtab ts=4 sw=4 sts=4: */
