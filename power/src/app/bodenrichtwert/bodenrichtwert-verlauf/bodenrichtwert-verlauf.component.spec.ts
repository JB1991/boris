import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {BodenrichtwertVerlaufComponent} from './bodenrichtwert-verlauf.component';

describe('BodenrichtwertVerlaufComponent', () => {
  let component: BodenrichtwertVerlaufComponent;
  let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenrichtwertVerlaufComponent],
      imports: [ HttpClientTestingModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertVerlaufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
