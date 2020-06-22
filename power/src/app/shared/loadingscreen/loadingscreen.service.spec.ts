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
  });
});
