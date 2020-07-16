import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StorageService } from './storage.service';

describe('Fragebogen.Fillout.StorageService', () => {
  let service: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(StorageService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.task).toBeNull();
    expect(service.form).toBeNull();
    expect(service.UnsavedChanges).toBeFalse();
  });
  it('should set unsavedchanges', () => {
    expect(service.getUnsavedChanges()).toBeFalse();
    service.setUnsavedChanges(true);
    expect(service.getUnsavedChanges()).toBeTrue();
  });
  it('should reset service', () => {
    service.form = {'a': 1};
    service.task = {'b': 2};
    service.resetService();
    expect(service.task).toBeNull();
    expect(service.form).toBeNull();
  });
});
