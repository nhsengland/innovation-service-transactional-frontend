import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { OrganisationDataResolver } from './organisation-data.resolver';

describe('FeatureModules/Admin/Resolvers/OrganisationDataResolver', () => {
  let resolver: OrganisationDataResolver;

  let orgnisationService: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    resolver = TestBed.inject(OrganisationDataResolver);

    orgnisationService = TestBed.inject(OrganisationsService);
  });

  it('should load resolver information', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };
    const organisationsResponseMock = {
      id: 'orgId01',
      name: 'Org name 01',
      acronym: 'ORG01',
      organisationUnits: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' }]
    };

    orgnisationService.getOrganisationInfo = () => of(organisationsResponseMock as any);

    let response: any = null;
    const expected = { id: 'orgId01', name: 'Org name 01', acronym: 'ORG01' };

    resolver
      .resolve(routeMock as any)
      .subscribe({ next: success => (response = success), error: error => (response = error) });
    expect(response).toEqual(expected);
  });

  it('should NOT load resolver information data', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };

    orgnisationService.getOrganisationInfo = () => throwError('error');

    let response: any = null;

    resolver
      .resolve(routeMock as any)
      .subscribe({ next: success => (response = success), error: error => (response = error) });
    expect(response).toBe('error');
  });
});
