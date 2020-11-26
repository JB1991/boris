import { TestBed } from '@angular/core/testing';

import { AlkisWfsService } from './alkis-wfs.service';

describe('AlkisWfsService', () => {
  let service: AlkisWfsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlkisWfsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
