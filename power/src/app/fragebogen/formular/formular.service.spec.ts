import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormularService } from './formular.service';

describe('FormularService', () => {
  let service: FormularService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(FormularService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
