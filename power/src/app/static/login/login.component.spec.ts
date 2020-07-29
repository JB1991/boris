import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Static.Login.LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent}
        ])
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        AuthService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    // xxx
  });
});

@Component({
  selector: 'power-home',
  template: ''
})
class MockHomeComponent {
}
