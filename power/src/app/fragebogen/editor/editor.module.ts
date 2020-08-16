import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

import { EditorRoutingModule } from './editor-routing.module';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { EditorComponent } from './editor.component';
import { FormularSettingsComponent } from './formular-settings/formular-settings.component';
import { ModalElementComponent } from './modal-element/modal-element.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ValidatorsComponent } from './validators/validators.component';
import { SvgPipe } from './svg.pipe';

import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [
        EditorComponent,
        FormularSettingsComponent,
        ModalElementComponent,
        ConditionsComponent,
        ValidatorsComponent,
        SvgPipe
    ],
    imports: [
        EditorRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot(),
        CollapseModule.forRoot(),
        AccordionModule.forRoot(),
        NgxSmoothDnDModule,
        SurveyjsModule,
        SharedModule
    ],
    providers: [
        StorageService,
        HistoryService,
    ]
})
export class EditorModule { }
