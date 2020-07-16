import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoadingscreenComponent } from './loadingscreen.component';
import { LoadingscreenService } from './loadingscreen.service';

describe('Shared.Loadingscreen.LoadingscreenComponent', () => {
  let component: LoadingscreenComponent;
  let fixture: ComponentFixture<LoadingscreenComponent>;
  let storage: LoadingscreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingscreenComponent ],
      imports: [ RouterTestingModule.withRoutes([]) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storage = TestBed.inject(LoadingscreenService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storage).toBeTruthy();
    expect(storage.isVisible()).toBeFalse();
  });

  // reset service after each test
  afterEach(() => {
    storage.resetService();
    storage = null;
  });
});
