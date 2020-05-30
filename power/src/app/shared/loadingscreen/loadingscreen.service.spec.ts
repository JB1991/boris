import { TestBed } from '@angular/core/testing';

import { LoadingscreenService } from './loadingscreen.service';

describe('Fragebogen.Loadingscreen.LoadingscreenService', () => {
  let service: LoadingscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
