import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

import { EditorRoutingModule } from './editor-routing.module';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { EditorComponent } from './editor.component';
import { FormularSettingsComponent } from './formular-settings/formular-settings.component';
import { QuestionSettingsComponent } from './question-settings/question-settings.component';
import { AnswersComponent } from './answers/answers.component';
import { ValueComponent } from './value/value.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ConditionModalComponent } from './condition-modal/condition-modal.component';
import { ValidatorsComponent } from './validators/validators.component';
import { LocaleInputComponent } from './localeinput/localeinput.component';

import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [
        EditorComponent,
        FormularSettingsComponent,
        QuestionSettingsComponent,
        AnswersComponent,
        ValueComponent,
        ConditionsComponent,
        ConditionModalComponent,
        ValidatorsComponent,
        LocaleInputComponent
    ],
    imports: [
        EditorRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        CollapseModule.forRoot(),
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxSmoothDnDModule,
        SurveyjsModule,
        SharedModule
    ],
    providers: [
        StorageService,
        HistoryService
    ]
})
export class EditorModule { }
