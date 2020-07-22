import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let config: ConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ConfigService
      ],
      declarations: [
        AppComponent,
        MockAlertsComponent,
        MockLoadingscreenComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    config = TestBed.inject(ConfigService);
  }));

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
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
    expect(app.config).toBeTruthy();
    expect(app.config.modules.length).toEqual(2);
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
