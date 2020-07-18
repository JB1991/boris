import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
        MockAlertsComponent,
        MockLoadingscreenComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  }));

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it(`should have 'power' as title`, async(() => {
    expect(app.title).toContain('power');
  }));

  it('should have a version number including a dot', async(() => {
    expect(app.appVersion).toContain('.');
  }));
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
