import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomeComponent } from './home.component';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Home.HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routing: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        Title,
        AuthService
      ],
      declarations: [
        HomeComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    routing = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect', () => {
    spyOn(routing, 'navigate');
    component.submitPIN('123');
    expect(routing.navigate).toHaveBeenCalledTimes(1);
    expect(routing.navigate).toHaveBeenCalledWith(['/forms', 'fillout', encodeURIComponent('123')],
      { replaceUrl: true });
  });

  it('should not redirect', () => {
    expect(function () {
      component.submitPIN('');
    }).toThrowError('pin is required');
  });
});
