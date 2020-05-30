import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FilloutComponent } from './fillout.component';
import { AlertsService } from '../alerts/alerts.service';
import { LoadingscreenService } from '../loadingscreen/loadingscreen.service';
import { StorageService } from './storage.service';

describe('Fragebogen.Fillout.FilloutComponent', () => {
  let component: FilloutComponent;
  let fixture: ComponentFixture<FilloutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {
                  return 123;
                }
              }
            }
          }
        },
        Title,
        AlertsService,
        LoadingscreenService,
        StorageService
      ],
      declarations: [
        FilloutComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
