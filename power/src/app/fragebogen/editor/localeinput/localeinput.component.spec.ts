import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaleInputComponent } from './localeinput.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

describe('Fragebogen.Editor.LocaleInputComponent', () => {
    let component: LocaleInputComponent;
    let fixture: ComponentFixture<LocaleInputComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                SurveyjsModule
            ],
            declarations: [
                LocaleInputComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LocaleInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
    }));

    it('should create', () => {
    });
});
