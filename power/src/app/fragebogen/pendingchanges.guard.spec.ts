import { TestBed } from '@angular/core/testing';

import { PendingChangesGuard } from './pendingchanges.guard';
import { Observable, Subject } from 'rxjs';

import { ComponentCanDeactivate } from './pendingchanges.guard';

describe('Fragebogen.PendingchangesGuard', () => {
  let mockComponent: MockComponent;
  let guard: PendingChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PendingChangesGuard,
        MockComponent
      ]
    });
    guard = TestBed.inject(PendingChangesGuard);
    mockComponent = TestBed.inject(MockComponent);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('can route if unguarded', () => {
    mockComponent.returnValue = true;
    expect(guard.canDeactivate(mockComponent)).toBeTrue();
  });

  it('can route if accepted', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockComponent.returnValue = false;
    expect(guard.canDeactivate(mockComponent)).toBeTrue();
  });

  it('can not route if declined', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    mockComponent.returnValue = false;
    expect(guard.canDeactivate(mockComponent)).toBeFalse();
  });
});

class MockComponent implements ComponentCanDeactivate {
  // Set this to the value you want to mock being returned from GuardedComponent
  returnValue: boolean | Observable<boolean>;

  canDeactivate(): boolean | Observable<boolean> {
    return this.returnValue;
  }
}
