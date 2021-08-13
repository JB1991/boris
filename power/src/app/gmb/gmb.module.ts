import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GmbRoutingModule } from './gmb-routing.module';
import { GmbComponent } from './gmb/gmb.component';

import { GmbofflineComponent } from './gmboffline/gmboffline.component';

@NgModule({
    declarations: [GmbComponent, GmbofflineComponent],
    imports: [
        CommonModule,
        GmbRoutingModule
    ]
})
export class GmbModule { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
