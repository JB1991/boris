import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FragebogenComponent } from './fragebogen.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        FragebogenComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FragebogenComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fragebogenonline'`, () => {
    const fixture = TestBed.createComponent(FragebogenComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('fragebogenonline');
  });
});
