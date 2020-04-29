import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { ModalFormularComponent } from './modal-formular.component';
import { StorageService } from '../storage.service';

describe('Fragebogen.Editor.ModalFormular.ModalFormularComponent', () => {
  let component: ModalFormularComponent;
  let fixture: ComponentFixture<ModalFormularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, ModalModule.forRoot() ],
      providers: [
        StorageService,
        BsModalService
      ],
      declarations: [ ModalFormularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
