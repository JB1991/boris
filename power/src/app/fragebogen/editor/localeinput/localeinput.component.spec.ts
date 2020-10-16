import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LocaleInputComponent } from './localeinput.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

describe('Fragebogen.Editor.LocaleInputComponent', () => {
    let component: LocaleInputComponent;
    let fixture: ComponentFixture<LocaleInputComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                SurveyjsModule
            ],
            declarations: [
                LocaleInputComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LocaleInputComponent);
        component = fixture.componentInstance;
        component.locale = {};
        component.eid = 'abc';
        fixture.detectChanges();

        spyOn(console, 'log');
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
