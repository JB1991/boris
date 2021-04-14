import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';

import { GmbRoutingModule } from './gmb-routing.module';
import { GmbComponent } from './gmb/gmb.component';

import * as echarts from 'echarts';
import { GmbofflineComponent } from './gmboffline/gmboffline.component';

@NgModule({
    declarations: [GmbComponent, GmbofflineComponent],
    imports: [
        CommonModule,
        GmbRoutingModule,
        NgxEchartsModule.forRoot({ echarts }) // eslint-disable-line object-shorthand
    ]
})
export class GmbModule { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
