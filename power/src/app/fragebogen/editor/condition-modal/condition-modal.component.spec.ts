import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConditionModalComponent } from './condition-modal.component';
import { ConditionsComponent } from '../conditions/conditions.component';

import { SharedModule } from '@app/shared/shared.module';

describe('Fragebogen.Editor.ConditionModalComponent', () => {
    let component: ConditionModalComponent;
    let fixture: ComponentFixture<ConditionModalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                SharedModule
            ],
            declarations: [
                ConditionModalComponent,
                ConditionsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConditionModalComponent);
        component = fixture.componentInstance;
        component.model = { pages: [] };
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        component.close(true);
        component.close(false);
    });
});
