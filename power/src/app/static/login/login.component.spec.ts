import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent}
        ]),
        FormsModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        AuthService,
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    spyOn(component.auth, 'login');
    spyOn(component.auth, 'getUser').and.returnValue({'username': 'Annegret', 'expires': new Date(), 'token': 1});
    TestBed.inject(ActivatedRoute).queryParams = of({ 'redirect': '/forms' });
    component.email = 'xxx';
    component.password = 'yyy';

    component.ngOnInit();
    expect(component.login()).toBeTrue();
    expect(component.redirect).toEqual('/forms');
  });

  it('should fail login', () => {
    spyOn(component.auth, 'login');

    expect(component.login()).toBeFalse();
    component.email = 'xxx';
    expect(component.login()).toBeFalse();
    component.password = 'yyy';
    component.redirect = '';
    expect(component.login()).toBeTrue();
  });
});

@Component({
  selector: 'power-home',
  template: ''
})
class MockHomeComponent {
}
