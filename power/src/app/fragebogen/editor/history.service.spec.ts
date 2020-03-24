import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HistoryService } from './history.service';
import { StorageService } from './storage.service';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ StorageService ]
    });
    service = TestBed.inject(HistoryService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
