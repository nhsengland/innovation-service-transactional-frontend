import { TestBed } from '@angular/core/testing';

import { ManageInnovationGuard } from './manage-innovation.guard';

describe('ManageInnovationGuard', () => {
  let guard: ManageInnovationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ManageInnovationGuard
      ]
    });

    guard = TestBed.inject(ManageInnovationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
