import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoadingscreenService } from './loadingscreen.service';

describe('Shared.Loadingscreen.LoadingscreenService', () => {
  let service: LoadingscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
    service = TestBed.inject(LoadingscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isVisible()).toBeFalse();
  });
  it('should change visibility', () => {
    service.setVisible(true);
    expect(service.isVisible()).toBeTrue();
    service.setVisible(false);
    expect(service.isVisible()).toBeFalse();
  });
  it('should reset service', () => {
    service.setVisible(true);

    // reset service
    service.resetService();
    expect(service.isVisible()).toBeFalse();
  });
});
