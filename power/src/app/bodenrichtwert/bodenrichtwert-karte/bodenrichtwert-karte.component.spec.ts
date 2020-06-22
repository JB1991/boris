import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';

import {BodenrichtwertKarteComponent} from './bodenrichtwert-karte.component';

describe('Bodenrichtwert.BodenrichtwertKarte.BodenrichtwertkarteComponent', () => {
  let component: BodenrichtwertKarteComponent;
  let fixture: ComponentFixture<BodenrichtwertKarteComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenrichtwertKarteComponent],
      imports: [ HttpClientTestingModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
    component = fixture.componentInstance;
    component.teilmarkt = '';
    fixture.detectChanges();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
