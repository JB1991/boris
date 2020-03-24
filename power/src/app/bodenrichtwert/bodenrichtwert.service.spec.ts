import {TestBed} from '@angular/core/testing';

import {BodenrichtwertService} from './bodenrichtwert.service';

describe('BodenrichtwertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodenrichtwertService = TestBed.get(BodenrichtwertService);
    expect(service).toBeTruthy();
  });
});
