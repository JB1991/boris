import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbAccordionModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { BodenrichtwertRoutingModule } from './bodenrichtwert-routing.module';
import { BodenrichtwertComponent } from './bodenrichtwert-component/bodenrichtwert.component';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte/bodenrichtwert-karte.component';
import { BodenrichtwertListeComponent } from './bodenrichtwert-liste/bodenrichtwert-liste.component';
import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail/bodenrichtwert-detail.component';
import { BodenrichtwertService } from './bodenrichtwert.service';
import { SharedModule } from '../shared/shared.module';
import { NutzungPipe } from './pipes/nutzung.pipe';
import { BeitragPipe } from './pipes/beitrag.pipe';
import { UmlautCorrectionPipe } from './pipes/umlaut-correction.pipe';

/**
 * This module provides user interface for Bodenrichtwerte.
 * Therefore it contains:
 * (1) Bodenrichtwert-Detail
 * (2) Bodenrichtwert-Karte
 * (3) Bodenrichtwert-Liste
 * (4) Bodenrichtwert-Verlauf
 * All subcomponents are arranged in Bodenrichtwert-Component
 * All data is loaded via Bodenrichtwert-Service.
 */
@NgModule({
    declarations: [
        BodenrichtwertKarteComponent,
        BodenrichtwertComponent,
        BodenrichtwertDetailComponent,
        BodenrichtwertVerlaufComponent,
        BodenrichtwertListeComponent,
        NutzungPipe,
        BeitragPipe,
        UmlautCorrectionPipe
    ],
    imports: [
        BodenrichtwertRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAccordionModule,
        NgbPaginationModule,
        NgxMapboxGLModule,
        NgxEchartsModule.forRoot({ echarts }),
        SharedModule,
        NgbDropdownModule
    ],
    providers: [BodenrichtwertService]
})
export class BodenrichtwertModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
