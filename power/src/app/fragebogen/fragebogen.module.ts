import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FragebogenRoutingModule } from './fragebogen-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { EditorModule } from './editor/editor.module';
import { DetailsModule } from './details/details.module';
import { FilloutModule } from './fillout/fillout.module';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        FragebogenRoutingModule,
        CommonModule,
        FormsModule,
        DashboardModule,
        DetailsModule,
        FilloutModule,
        EditorModule
    ]
})

export class FragebogenModule {
    constructor() {
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
