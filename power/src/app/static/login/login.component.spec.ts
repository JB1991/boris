import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { LoginComponent } from './login.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('Static.Login.LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

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
        Title,
        AuthService,
        LoadingscreenService,
        AlertsService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    spyOn(component, 'redirect');
    fixture.detectChanges();

    spyOn(console, 'log');
    spyOn(component.router, 'navigate');
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.removeItem('user');
    component.auth.user = null;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect authenticated user', (done) => {
    // valid session, redirect user
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 200);
    component.auth.user = {'expires': expire, 'token': 5};

    component.authenticate().then((value) => {
      expect(console.log).toHaveBeenCalledWith('User is authenticated');
      done();
    });
  });

  it('should request token', (done) => {
    // set keycloak return code
    spyOn(component.activatedRoute.snapshot.queryParamMap, 'get').and.returnValue('abc');

    component.authenticate().then((value) => {
      expect(console.log).toHaveBeenCalledWith('User has authenticated');
      done();
    });

    answerHTTPRequest(environment.auth.url + 'token', 'POST', {'expires_in': 900, 'access_token': 'XXX'});
  });

  it('should fail request token', (done) => {
    // set keycloak return code
    spyOn(component.activatedRoute.snapshot.queryParamMap, 'get').and.returnValue('abc');
    spyOn(component.auth, 'KeycloakToken');

    component.authenticate().then((value) => {
      expect(console.log).toHaveBeenCalledWith('Authentication failed');
      done();
    });
  });

  /**
   * Mocks the API by taking HTTP requests form the queue and returning the answer
   * @param url The URL of the HTTP request
   * @param method HTTP request method
   * @param body The body of the answer
   * @param opts Optional HTTP information of the answer
   */
  function answerHTTPRequest(url, method, body, opts?) {
    // Take HTTP request from queue
    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toEqual(method);

    // Return the answer
    request.flush(deepCopy(body), opts);
  }

  function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  afterEach(() => {
    // Verify that no requests are remaining
    httpTestingController.verify();

    // clear storage
    localStorage.removeItem('user');
    component.auth.user = null;
  });
});

@Component({
  selector: 'power-home',
  template: ''
})
class MockHomeComponent {
}
