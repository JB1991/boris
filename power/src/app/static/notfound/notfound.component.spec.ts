import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SEOService } from '@app/shared/seo/seo.service';

import { NotfoundComponent } from './notfound.component';

describe('Static.Notfound.NotfoundComponent', () => {
    let component: NotfoundComponent;
    let fixture: ComponentFixture<NotfoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                SEOService
            ],
            declarations: [
                NotfoundComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NotfoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
