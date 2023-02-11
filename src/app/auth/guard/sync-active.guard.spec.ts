import { TestBed } from '@angular/core/testing';

import { SyncActiveGuard } from './sync-active.guard';

describe('SyncActiveGuard', () => {
  let guard: SyncActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SyncActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
