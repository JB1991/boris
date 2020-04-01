import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BodenrichtwertDetailComponent} from './bodenrichtwert-detail.component';

describe('BodenrichtwertDetailComponent', () => {
  let component: BodenrichtwertDetailComponent;
  let fixture: ComponentFixture<BodenrichtwertDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenrichtwertDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertDetailComponent);
    component = fixture.componentInstance;
    component.feature = { properties: { } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
