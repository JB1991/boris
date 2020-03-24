import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BodenrichtwertKarteComponent} from './bodenrichtwert-karte.component';

describe('BodenrichtwertkarteComponent', () => {
  let component: BodenrichtwertKarteComponent;
  let fixture: ComponentFixture<BodenrichtwertKarteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenrichtwertKarteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
