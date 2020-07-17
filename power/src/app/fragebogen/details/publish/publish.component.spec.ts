import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { PublishComponent } from './publish.component';
import { StorageService } from '../storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { environment } from '@env/environment';

describe('Fragebogen.Details.Publish.PublishComponent', () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;
  let storage: StorageService;
  let alerts: jasmine.SpyObj<AlertsService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const formSample = require('../../../../assets/fragebogen/form-sample.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ModalModule.forRoot()
      ],
      providers: [
        BsModalService,
        StorageService,
        {
          provide: AlertsService,
          useValue: jasmine.createSpyObj('AlertsService', ['NewAlert'])
        },
      ],
      declarations: [
        PublishComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storage = TestBed.inject(StorageService);
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close', () => {
    component.open();
    expect(component.modal.isShown).toBeTrue();
    component.close();
    expect(component.modal.isShown).toBeFalse();
  });

  it('should publish', () => {
    component.storage.form = {'id': '123'};
    component.pin = 'pin6';
    component.open();
    spyOn(window, 'confirm').and.returnValue(true);

    component.Publish();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123?publish=true&access=pin6&access-minutes=60',
                      'POST', formSample);
    expect(component.modal.isShown).toBeFalse();
  });

  it('should not publish', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.Publish();
    expect(alerts.NewAlert).toHaveBeenCalledTimes(0);
  });

  it('should error 404', () => {
    component.storage.form = {'id': '123'};
    spyOn(window, 'confirm').and.returnValue(true);

    component.Publish();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123?publish=true&access=pin8&access-minutes=60',
                      'POST', formSample, { status: 404, statusText: 'Not Found' });
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Veröffentlichen fehlgeschlagen', 'Not Found');
  });

  it('should fail to publish', () => {
    component.storage.form = {'id': '123'};
    spyOn(window, 'confirm').and.returnValue(true);

    component.Publish();
    answerHTTPRequest(environment.formAPI + 'intern/forms/123?publish=true&access=pin8&access-minutes=60',
                      'POST', null);
    expect(alerts.NewAlert).toHaveBeenCalledTimes(1);
    expect(alerts.NewAlert).toHaveBeenCalledWith('danger', 'Veröffentlichen fehlgeschlagen', '123');
  });

  /**
   * Mocks the API by taking HTTP requests form the queue and returning the answer
   * @param url The URL of the HTTP request
   * @param method HTTP request method
   * @param body The body of the answer
   * @param opts Optional HTTP information of the answer
   */
  function answerHTTPRequest(url, method, body, opts?) {
    // Take HTTP request from queue
    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toEqual(method);

    // Return the answer
    request.flush(deepCopy(body), opts);
  }

  function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  afterEach(() => {
    storage.resetService();
    storage = null;

    // Verify that no requests are remaining
    httpTestingController.verify();

    // Destruction
    fixture.destroy();
    component = null;
  });
});
