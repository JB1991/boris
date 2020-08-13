import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

import { EditorRoutingModule } from './editor-routing.module';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { EditorComponent } from './editor.component';
import { ModalFormularComponent } from './modal-formular/modal-formular.component';
import { ModalElementComponent } from './modal-element/modal-element.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ValidatorsComponent } from './validators/validators.component';

import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

@NgModule({
    declarations: [
        EditorComponent,
        ModalFormularComponent,
        ModalElementComponent,
        ConditionsComponent,
        ValidatorsComponent

    ],
    imports: [
        EditorRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot(),
        CollapseModule.forRoot(),
        NgxSmoothDnDModule,
        SurveyjsModule
    ],
    providers: [
        StorageService,
        HistoryService,
    ]
})
export class EditorModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
