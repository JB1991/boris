import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConditionModalComponent } from './condition-modal.component';
import { ConditionsComponent } from '../conditions/conditions.component';

describe('Fragebogen.Editor.ConditionModalComponent', () => {
    let component: ConditionModalComponent;
    let fixture: ComponentFixture<ConditionModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            declarations: [
                ConditionModalComponent,
                ConditionsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConditionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        component.close();
    });
});
