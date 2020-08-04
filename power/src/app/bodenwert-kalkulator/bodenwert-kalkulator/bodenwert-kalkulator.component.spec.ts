import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { BodenwertKalkulatorComponent } from './bodenwert-kalkulator.component';

describe('BodenwertKalkulator.BodenwertKalkulator.BodenwertKalkulatorComponent', () => {
  let component: BodenwertKalkulatorComponent;
  let fixture: ComponentFixture<BodenwertKalkulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodenwertKalkulatorComponent, NgbAccordion]
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
