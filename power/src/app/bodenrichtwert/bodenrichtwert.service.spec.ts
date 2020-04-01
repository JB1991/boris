import {async, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {BodenrichtwertService} from './bodenrichtwert.service';

describe('BodenrichtwertService', () => {
  let service: BodenrichtwertService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(BodenrichtwertService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
