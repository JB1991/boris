import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { MaketaskComponent } from './maketask.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

describe('Fragebogen.Details.Maketask.MaketaskComponent', () => {
  let component: MaketaskComponent;
  let fixture: ComponentFixture<MaketaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ModalModule.forRoot()
      ],
      providers: [
        BsModalService,
        AlertsService,
        StorageService
      ],
      declarations: [ MaketaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaketaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
