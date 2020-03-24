import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccessGuard } from './access.guard';
import { FormularService } from './formular.service';

describe('AccessGuard', () => {
  let service: AccessGuard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [ FormularService ]
    });
    service = TestBed.inject(AccessGuard);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
