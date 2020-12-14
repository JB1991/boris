import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { NgxEchartsModule } from 'ngx-echarts';

import { ImmobilienRoutingModule } from './immobilien-routing.module';
import { ImmobilienComponent } from './immobilien/immobilien.component';

import { FormsModule } from '@angular/forms';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

import {
    building,
    houseFill,
    plusCircle,
    dashCircle,
    fileEarmarkImage,
    fileEarmarkSpreadsheet,
    fileEarmarkRichtext
} from 'ngx-bootstrap-icons';

import * as echarts from 'echarts';

// Select some icons (use an object, not an array)
/* eslint-disable object-shorthand */
const icons = {
    building,
    houseFill,
    plusCircle,
    dashCircle,
    fileEarmarkImage,
    fileEarmarkSpreadsheet,
    fileEarmarkRichtext
};
/* eslint-enable object-shorthand */

@NgModule({
    imports: [
        CommonModule,
        ImmobilienRoutingModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        TypeaheadModule.forRoot(),
        FormsModule,
        NgxBootstrapIconsModule.pick(icons),
        NgxEchartsModule.forRoot({ echarts }) // eslint-disable-line object-shorthand
    ],
    declarations: [ImmobilienComponent]
})

export class ImmobilienModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
