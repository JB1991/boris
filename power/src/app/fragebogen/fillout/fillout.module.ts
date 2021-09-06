import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilloutRoutingModule } from './fillout-routing.module';
import { FilloutComponent } from './fillout.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        FilloutComponent
    ],
    imports: [
        CommonModule,
        FilloutRoutingModule,
        SurveyjsModule,
        FormsModule
    ],
    providers: [
    ]
})
export class FilloutModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
