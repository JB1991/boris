import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageService } from './storage.service';
import { AuthService } from '@app/shared/auth/auth.service';

describe('Fragebogen.Editor.StorageService', () => {
  let service: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(StorageService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
