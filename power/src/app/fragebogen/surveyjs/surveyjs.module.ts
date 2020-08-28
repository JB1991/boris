import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowdownModule } from 'ngx-showdown';
import { FormsModule } from '@angular/forms';

import { WrapperComponent } from './wrapper.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewPipe } from './preview.pipe';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [
        WrapperComponent,
        PreviewComponent,
        PreviewPipe
    ],
    imports: [
        CommonModule,
        SharedModule,
        ShowdownModule,
        FormsModule
    ],
    exports: [
        WrapperComponent,
        PreviewComponent,
        PreviewPipe
    ]
})
export class SurveyjsModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
