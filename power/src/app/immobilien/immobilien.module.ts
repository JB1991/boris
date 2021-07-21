import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ImmobilienRoutingModule } from './immobilien-routing.module';
import { ImmobilienComponent } from './immobilien/immobilien.component';

import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ImmobilienRoutingModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        FormsModule
    ],
    declarations: [ImmobilienComponent]
})

export class ImmobilienModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
