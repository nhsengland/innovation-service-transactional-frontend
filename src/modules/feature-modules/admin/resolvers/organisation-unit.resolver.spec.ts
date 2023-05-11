import { TestBed } from '@angular/core/testing';

import { OrganisationUnitDataResolver } from './organisation-unit-data.resolver';

describe('OrganisationUnitDataResolver', () => {
  let resolver: OrganisationUnitDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OrganisationUnitDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
