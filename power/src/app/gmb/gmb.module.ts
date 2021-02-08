import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';

import { GmbRoutingModule } from './gmb-routing.module';
import { GmbComponent } from './gmb/gmb.component';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

import {
    download,
    plusCircle,
    dashCircle,
    infoCircle
} from 'ngx-bootstrap-icons';

import * as echarts from 'echarts';

// Select some icons (use an object, not an array)
/* eslint-disable object-shorthand */
const icons = {
    download,
    plusCircle,
    dashCircle,
    infoCircle
};

@NgModule({
    declarations: [GmbComponent],
    imports: [
        CommonModule,
        GmbRoutingModule,
        NgxEchartsModule.forRoot({ echarts }), // eslint-disable-line object-shorthand
        NgxBootstrapIconsModule.forRoot(icons)
    ]
})
export class GmbModule { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
