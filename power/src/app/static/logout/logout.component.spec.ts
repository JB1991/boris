import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Meta, Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

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
                Title,
                Meta,
                AuthService,
                LoadingscreenService,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        spyOn(console, 'error');
        spyOn(component.router, 'navigate');

        redirectspy = spyOn(component, 'redirect');
        localStorage.removeItem('user');
        component.auth.user = null;
        fixture.detectChanges();
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
