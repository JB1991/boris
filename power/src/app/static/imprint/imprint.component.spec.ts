import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SEOService } from '@app/shared/seo/seo.service';

import { ImprintComponent } from './imprint.component';

describe('ImprintComponent', () => {
    let component: ImprintComponent;
    let fixture: ComponentFixture<ImprintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                SEOService
            ],
            declarations: [
                ImprintComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
