import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { BodenrichtwertComponent } from './bodenrichtwert.component';

describe('Bodenrichtwert.BodenrichtwertComponent.BodenrichtwertComponent', () => {
  let component: BodenrichtwertComponent;
  let fixture: ComponentFixture<BodenrichtwertComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BodenrichtwertComponent
      ],
      imports: [
        HttpClientTestingModule,
        NgbAccordionModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodenrichtwertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
