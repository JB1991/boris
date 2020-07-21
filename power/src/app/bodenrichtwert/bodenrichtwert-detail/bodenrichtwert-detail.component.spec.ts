import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail.component';
import { BeitragPipe } from '@app/bodenrichtwert/pipes/beitrag.pipe';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { HyphenatePipe } from '@app/bodenrichtwert/pipes/hyphenate.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.BodenrichtwertDetailComponent', () => {
  let component: BodenrichtwertDetailComponent;
  let fixture: ComponentFixture<BodenrichtwertDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BodenrichtwertDetailComponent,
        BeitragPipe,
        NutzungPipe,
        HyphenatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertDetailComponent);
    component = fixture.componentInstance;
    component.feature = {
      properties: {
        nutzung: [{nutz: 'W', 'enuta': ['EFH']}]
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
