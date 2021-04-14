import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NgxEchartsModule } from 'ngx-echarts';

import { ImmobilienRoutingModule } from './immobilien-routing.module';
import { ImmobilienComponent } from './immobilien/immobilien.component';

import { FormsModule } from '@angular/forms';

import * as echarts from 'echarts';

@NgModule({
    imports: [
        CommonModule,
        ImmobilienRoutingModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        FormsModule,
        NgxEchartsModule.forRoot({ echarts }) // eslint-disable-line object-shorthand
    ],
    declarations: [ImmobilienComponent]
})

export class ImmobilienModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
