import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('Static.Logout.LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent}
        ])
      ],
      declarations: [
        LogoutComponent
      ],
      providers: [
        AuthService,
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('success', 'Sie wurden erfolgreich ausgeloggt', '');
  });
});

@Component({
  selector: 'power-home',
  template: ''
})
class MockHomeComponent {
}
