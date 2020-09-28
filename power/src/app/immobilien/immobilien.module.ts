import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxEchartsModule } from 'ngx-echarts';

import { ImmobilienRoutingModule } from './immobilien-routing.module';
import { ImmobilienComponent } from './immobilien/immobilien.component';

import { FormsModule } from '@angular/forms';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { Building, HouseFill, PlusCircle, DashCircle } from 'ngx-bootstrap-icons';

import * as echarts from 'echarts';

// Select some icons (use an object, not an array)
const icons = {
    Building,
    HouseFill,
    PlusCircle,
    DashCircle
};

@NgModule({
    imports: [
        CommonModule,
        ImmobilienRoutingModule,
        NgbModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        FormsModule,
        NgxBootstrapIconsModule.pick(icons),
        NgxEchartsModule.forRoot({ echarts })
    ],
    declarations: [ImmobilienComponent]
})

export class ImmobilienModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
