import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BodenrichtwertVerlaufComponent} from './bodenrichtwert-verlauf.component';

describe('BodenrichtwertVerlaufComponent', () => {
  let component: BodenrichtwertVerlaufComponent;
  let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenrichtwertVerlaufComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertVerlaufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
