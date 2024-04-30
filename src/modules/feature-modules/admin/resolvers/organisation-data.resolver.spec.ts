import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { organisationDataResolver } from './organisation-data.resolver';
import { result } from 'lodash';

describe('FeatureModules/Admin/Resolvers/OrganisationDataResolver', () => {
  let organisationService: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    organisationService = TestBed.inject(OrganisationsService);
  });

  it('should load resolver information', () => {
    const organisationsResponseMock = {
      id: 'orgId01',
      name: 'Org name 01',
      acronym: 'ORG01',
      organisationUnits: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' }]
    };

    organisationService.getOrganisationInfo = () => of(organisationsResponseMock as any);

    let response: any = null;
    const expected = { id: 'orgId01', name: 'Org name 01', acronym: 'ORG01' };

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };

    const resolver = runInInjectionContext(TestBed.inject(EnvironmentInjector), () =>
      organisationDataResolver(routeMock as any, {} as RouterStateSnapshot)
    );

    (resolver as Observable<{ id: string; name: string; acronym: string }>).subscribe({
      next: success => (response = success),
      error: error => (response = error.message)
    });

    expect(response).toEqual(expected);
  });

  it('should NOT load resolver information data', () => {
    organisationService.getOrganisationInfo = () => throwError(() => new Error('error'));

    let response: any = null;

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };

    const resolver = runInInjectionContext(TestBed.inject(EnvironmentInjector), () =>
      organisationDataResolver(routeMock as any, {} as RouterStateSnapshot)
    );

    (resolver as Observable<{ id: string; name: string; acronym: string }>).subscribe({
      next: success => (response = success),
      error: error => (response = error.message)
    });
    expect(response).toBe('error');
  });
});

// describe('FeatureModules/Admin/Resolvers/OrganisationDataResolver', () => {
//   let resolver: OrganisationDataResolver;

//   let orgnisationService: OrganisationsService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, AdminModule]
//     });

//     AppInjector.setInjector(TestBed.inject(Injector));

//     resolver = TestBed.inject(OrganisationDataResolver);

//     orgnisationService = TestBed.inject(OrganisationsService);
//   });

//   it('should load resolver information', () => {
//     const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };
//     const organisationsResponseMock = {
//       id: 'orgId01',
//       name: 'Org name 01',
//       acronym: 'ORG01',
//       organisationUnits: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' }]
//     };

//     orgnisationService.getOrganisationInfo = () => of(organisationsResponseMock as any);

//     let response: any = null;
//     const expected = { id: 'orgId01', name: 'Org name 01', acronym: 'ORG01' };

//     resolver
//       .resolve(routeMock as any)
//       .subscribe({ next: success => (response = success), error: error => (response = error) });
//     expect(response).toEqual(expected);
//   });

//   it('should NOT load resolver information data', () => {
//     const routeMock: Partial<ActivatedRouteSnapshot> = { params: { organisationId: 'orgId01' } };

//     orgnisationService.getOrganisationInfo = () => throwError('error');

//     let response: any = null;

//     resolver
//       .resolve(routeMock as any)
//       .subscribe({ next: success => (response = success), error: error => (response = error) });
//     expect(response).toBe('error');
//   });
// });
