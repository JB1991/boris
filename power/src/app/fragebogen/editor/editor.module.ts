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
import { QuestionSettingsComponent } from './question-settings/question-settings.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ValidatorsComponent } from './validators/validators.component';
import { ValueComponent } from './value/value.component';
import { SvgPipe } from './svg.pipe';

import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';
import { SharedModule } from '@app/shared/shared.module';
import { AnswersComponent } from './answers/answers.component';

@NgModule({
    declarations: [
        EditorComponent,
        FormularSettingsComponent,
        QuestionSettingsComponent,
        AnswersComponent,
        ConditionsComponent,
        ValidatorsComponent,
        ValueComponent,
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
