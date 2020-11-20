import { LOCALE_ID } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { QuestionSettingsComponent } from './question-settings.component';
import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';
import { ConditionsComponent } from '../conditions/conditions.component';
import { ValidatorsComponent } from '../validators/validators.component';
import { ValueComponent } from '../value/value.component';
import { LocaleInputComponent } from '../localeinput/localeinput.component';

import { SharedModule } from '@app/shared/shared.module';
import { AnswersComponent } from '../answers/answers.component';

describe('Fragebogen.Editor.QuestionSettingsComponent', () => {
    let component: QuestionSettingsComponent;
    let fixture: ComponentFixture<QuestionSettingsComponent>;

    const formSample = require('../../../../assets/fragebogen/surveyjs.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                AccordionModule.forRoot(),
                FormsModule,
                SharedModule
            ],
            providers: [
                { provide: LOCALE_ID, useValue: 'de' },
                StorageService,
                HistoryService
            ],
            declarations: [
                QuestionSettingsComponent,
                ConditionsComponent,
                ValidatorsComponent,
                ValueComponent,
                AnswersComponent,
                LocaleInputComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.alerts, 'NewAlert');
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open modal', () => {
        component.model = formSample;
        component.open(0, 0);
        expect(component.modal.isVisible()).toBeTrue();
        component.modal.close();
        expect(component.modal.isVisible()).toBeFalse();

        component.close(false);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    });

    it('should update model', () => {
        component.model = formSample;
        component.open(0, 0);
        expect(component.storage.getUnsavedChanges()).toBeFalse();
        component.model.title.default = 'xxx';
        component.modal.close();
        expect(component.storage.getUnsavedChanges()).toBeTrue();
    });

    it('should crash open', () => {
        component.model = formSample;

        expect(() => {
            component.open(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.open(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.open(-1, 0);
        }).toThrowError('question is invalid');
        expect(() => {
            component.open(2, 0);
        }).toThrowError('question is invalid');
    });
});