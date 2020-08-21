import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { ShareformComponent } from './shareform.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('ShareformComponent', () => {
  let component: ShareformComponent;
  let fixture: ComponentFixture<ShareformComponent>;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../../assets/fragebogen/form-sample.json');

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          imports: [
              HttpClientTestingModule,
              FormsModule,
              ModalModule.forRoot(),
              RouterTestingModule.withRoutes([])
          ],
          providers: [
              BsModalService,
              StorageService,
              AlertsService
          ],
          declarations: [
              ShareformComponent
          ]
      }).compileComponents();

      fixture = TestBed.createComponent(ShareformComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      spyOn(console, 'log');
      spyOn(component.alerts, 'NewAlert');
      httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
