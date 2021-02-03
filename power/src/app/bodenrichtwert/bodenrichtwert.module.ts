import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgxEchartsModule } from 'ngx-echarts';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import * as echarts from 'echarts';

import { BodenrichtwertRoutingModule } from './bodenrichtwert-routing.module';
import { BodenrichtwertComponent } from './bodenrichtwert-component/bodenrichtwert.component';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte/bodenrichtwert-karte.component';
import { BodenrichtwertListeComponent } from './bodenrichtwert-liste/bodenrichtwert-liste.component';
import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail/bodenrichtwert-detail.component';
import { UmrechnungComponent } from './bodenrichtwert-detail/umrechnung/umrechnung.component';
import { BodenrichtwertService } from './bodenrichtwert.service';
import { SharedModule } from '../shared/shared.module';
import { NutzungPipe } from './pipes/nutzung.pipe';
import { BeitragPipe } from './pipes/beitrag.pipe';
import { UmlautCorrectionPipe } from './pipes/umlaut-correction.pipe';
import { EntwicklungszustandPipe } from './pipes/entwicklungszustand.pipe';
import { EntwicklungszusatzPipe } from './pipes/entwicklungszusatz.pipe';
import { ObjectIdPipe } from './pipes/object-id.pipe';
import { EinflussgroessePipe } from './pipes/einflussgroesse.pipe';
import { ArtDerBebauungPipe } from './pipes/art-der-bebauung.pipe';
import { BauweisePipe } from './pipes/bauweise.pipe';
import { BodenartPipe } from './pipes/bodenart.pipe';
import { VerfahrensartPipe } from './pipes/verfahrensart.pipe';
import { NutzungBremenPipe } from './pipes/nutzung-bremen.pipe';

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
        UmrechnungComponent,
        NutzungPipe,
        BeitragPipe,
        UmlautCorrectionPipe,
        EntwicklungszustandPipe,
        EntwicklungszusatzPipe,
        ObjectIdPipe,
        EinflussgroessePipe,
        ArtDerBebauungPipe,
        BauweisePipe,
        BodenartPipe,
        VerfahrensartPipe,
        NutzungBremenPipe
    ],
    imports: [
        BodenrichtwertRoutingModule,
        CommonModule,
        NgxMapboxGLModule,
        NgxEchartsModule.forRoot({ echarts: echarts }),
        SharedModule,
        BsDropdownModule.forRoot(),
        AlertModule.forRoot(),
        CollapseModule.forRoot()
    ],
    providers: [BodenrichtwertService]
})
export class BodenrichtwertModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
