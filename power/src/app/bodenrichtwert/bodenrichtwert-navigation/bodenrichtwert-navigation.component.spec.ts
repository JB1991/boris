import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodenrichtwertNavigationComponent } from './bodenrichtwert-navigation.component';

describe('NavigationComponent', () => {
    let component: BodenrichtwertNavigationComponent;
    let fixture: ComponentFixture<BodenrichtwertNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BodenrichtwertNavigationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
