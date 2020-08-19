import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';

describe('Fragebogen.Editor.AnswersComponent', () => {
    let component: AnswersComponent;
    let fixture: ComponentFixture<AnswersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AnswersComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnswersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
