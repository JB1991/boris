import {TestBed} from '@angular/core/testing';

import {AppNameService} from './app-name.service';

describe('AppNameService', () => {
  let service: AppNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
