import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { SettingsComponent } from './settings.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
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
            SettingsComponent
          ]
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsComponent);
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
