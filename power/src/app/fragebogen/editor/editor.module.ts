import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { ModalFormularComponent } from './modal-formular/modal-formular.component';
import { ModalElementComponent } from './modal-element/modal-element.component';
import { PreviewComponent } from './preview/preview.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ValidatorsComponent } from './validators/validators.component';

import { PreviewPipe } from './preview.pipe';
import { StorageService } from './storage.service';
import { HistoryService } from './history.service';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { SurveyjsModule } from '../surveyjs/surveyjs.module';

@NgModule({
  declarations: [
    EditorComponent,
    ModalFormularComponent,
    ModalElementComponent,
    PreviewPipe,
    PreviewComponent,
    ConditionsComponent,
    ValidatorsComponent,
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    FormsModule,
    NgxSmoothDnDModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    SurveyjsModule
  ],
  providers: [
    StorageService,
    HistoryService,
  ]
})
export class EditorModule { }
