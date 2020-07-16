import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';

describe('Fragebogen.Surveyjs.Preview.PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open/close', () => {
    expect(component.isOpen).toBeFalse();
    component.Toggle();
    expect(component.isOpen).toBeTrue();
    component.Toggle();
    expect(component.isOpen).toBeFalse();
  });
});
