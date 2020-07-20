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
    spyOn(console, 'log');
    component.debugPrint('x');
  });

  it('should crash', () => {
    expect(function () {
      component.Open('ediet');
    }).toThrowError('mode is invalid');
  });

  it('should open/close', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.mode).toEqual('edit');

    component.Open();
    expect(component.isOpen).toBeTrue();
    expect(component.mode).toEqual('edit');

    component.Close();
    expect(component.isOpen).toBeFalse();
    expect(component.data).toBeNull();

    component.Open('display', 5);
    expect(component.mode).toEqual('display');
    expect(component.data).toEqual(5);
  });
});
