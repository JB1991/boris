import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoadingscreenService } from './loadingscreen.service';

describe('Fragebogen.Loadingscreen.LoadingscreenService', () => {
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
    expect(service.isVisible).toBeFalsy();
  });
  it('should change visibility', () => {
    service.setVisible(true);
    expect(service.isVisible).toBeTruthy();
    service.setVisible(false);
    expect(service.isVisible).toBeFalsy();
  });
  it('should reset alert.service', () => {
    service.setVisible(true);

    // reset service
    service.resetService();
    expect(service.isVisible).toBeFalsy();
  });
});
