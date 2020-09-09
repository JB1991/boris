import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Static.Logout.LogoutComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;
    let redirectspy: jasmine.Spy<(url: any) => void>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: MockHomeComponent }
                ])
            ],
            declarations: [
                LogoutComponent
            ],
            providers: [
                AuthService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        redirectspy = spyOn(component, 'redirect');
        fixture.detectChanges();

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        localStorage.removeItem('user');
        component.auth.user = null;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.loadingscreen.isVisible()).toBeTrue();

        redirectspy.and.callThrough();
        component.redirect(window.location.href + '#karma');
    });
});

@Component({
    selector: 'power-home',
    template: ''
})
class MockHomeComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
