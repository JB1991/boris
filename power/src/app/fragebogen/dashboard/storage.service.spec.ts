import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StorageService } from './storage.service';

describe('Fragebogen.Dashboard.StorageService', () => {
  let service: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(StorageService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
