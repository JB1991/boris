import { TestBed, async, inject } from '@angular/core/testing';

import { PendingChangesGuard } from './pendingchanges.guard';

describe('Fragebogen.PendingchangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingChangesGuard]
    });
  });

  it('should ...', inject([PendingChangesGuard], (guard: PendingChangesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
