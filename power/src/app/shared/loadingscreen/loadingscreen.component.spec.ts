import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoadingscreenComponent } from './loadingscreen.component';
import { LoadingscreenService } from './loadingscreen.service';

describe('Shared.Loadingscreen.LoadingscreenComponent', () => {
    let component: LoadingscreenComponent;
    let fixture: ComponentFixture<LoadingscreenComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                LoadingscreenService
            ],
            declarations: [
                LoadingscreenComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingscreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.loadingscreen).toBeTruthy();
        expect(component.loadingscreen.isVisible()).toBeFalse();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
