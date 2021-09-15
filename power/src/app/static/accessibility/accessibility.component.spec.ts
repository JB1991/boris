import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SEOService } from '@app/shared/seo/seo.service';

import { AccessibilityComponent } from './accessibility.component';

describe('AccessibilityComponent', () => {
    let component: AccessibilityComponent;
    let fixture: ComponentFixture<AccessibilityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                SEOService
            ],
            declarations: [
                AccessibilityComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessibilityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
