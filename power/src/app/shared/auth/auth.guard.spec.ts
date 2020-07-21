import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { AuthGuard } from './auth.guard';
import { AlertsService } from '../alerts/alerts.service';
import { ConfigService } from '@app/config.service';
import { AuthService } from './auth.service';

describe('Shared.Auth.AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockLoginComponent}
        ])
      ],
      providers: [
        ConfigService,
        AuthService,
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    spyOn(console, 'log');
    spyOn(guard.router, 'navigate');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should open in dev', () => {
    guard.conf.config = {'modules': [], 'authentication': false};
    expect(guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: '/private'})).toBeTrue();
  });

  it('should deny access', () => {
    guard.conf.config = {'modules': [], 'authentication': true};
    environment.production = true;

    expect(guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: '/private'})).toBeFalse();
  });

  it('should allow access', () => {
    guard.conf.config = {'modules': [], 'authentication': true};
    environment.production = true;
    guard.auth.user = {'username': 'Helga', 'token': 6};

    expect(guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: '/private'})).toBeTrue();
  });

  afterEach(() => {
    environment.production = false;

    // clear storage
    localStorage.clear();
  });
});

@Component({
  selector: 'power-login',
  template: ''
})
class MockLoginComponent {
}
