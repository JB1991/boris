import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SEOService } from '@app/shared/seo/seo.service';

import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent', () => {
    let component: PrivacyComponent;
    let fixture: ComponentFixture<PrivacyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                SEOService
            ],
            declarations: [
                PrivacyComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrivacyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
