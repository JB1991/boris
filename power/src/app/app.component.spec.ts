import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ConfigService,
        AuthService
      ],
      declarations: [
        AppComponent,
        MockAlertsComponent,
        MockLoadingscreenComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    spyOn(console, 'log');
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create the app', async(() => {
    expect(app).toBeTruthy();

    spyOn(app.cdRef, 'detectChanges');
    app.ngAfterViewChecked();
  }));

  it(`should have 'power' as title`, async(() => {
    expect(app.title).toContain('power');
  }));

  it('should have a version number including a dot', async(() => {
    expect(app.appVersion.version).toEqual('local');
  }));

  it('should load config', () => {
    app.configService.config = {'modules': ['a', 'b'], 'authentication': false};
    app.ngOnInit();
    answerHTTPRequest('./assets/version.json', 'GET', {version: '123456', branch: 'prod'});

    expect(app.config).toBeTruthy();
    expect(app.config.modules.length).toEqual(2);
    expect(app.appVersion).toEqual({version: '123456', branch: 'prod'});
  });

  it('should fail load config', () => {
    // load config
    app.configService.config = {'modules': ['a', 'b'], 'authentication': false};
    app.ngOnInit();
    answerHTTPRequest('./assets/version.json', 'GET', {branch: 'prod'});

    expect(app.config).toBeTruthy();
    expect(app.config.modules.length).toEqual(2);
    expect(app.appVersion).toEqual({version: 'local', branch: 'dev'});
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
  });
});

@Component({
  selector: 'power-alerts',
  template: ''
})
class MockAlertsComponent {
}
@Component({
  selector: 'power-loadingscreen',
  template: ''
})
class MockLoadingscreenComponent {
}
