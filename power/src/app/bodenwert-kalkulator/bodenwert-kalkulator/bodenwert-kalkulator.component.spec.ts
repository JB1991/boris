import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BodenwertKalkulatorComponent} from './bodenwert-kalkulator.component';

describe('BodenwertKalkulatorComponent', () => {
  let component: BodenwertKalkulatorComponent;
  let fixture: ComponentFixture<BodenwertKalkulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenwertKalkulatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenwertKalkulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
