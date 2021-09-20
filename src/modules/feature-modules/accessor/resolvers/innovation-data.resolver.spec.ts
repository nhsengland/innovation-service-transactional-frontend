import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationDataResolver } from './innovation-data.resolver';

import { AccessorService } from '../services/accessor.service';

import { INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


describe('FeatureModules/Accessor/Resolvers/InnovationDataResolver', () => {

  let resolver: InnovationDataResolver;

  let accessorService: AccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    resolver = TestBed.inject(InnovationDataResolver);

    accessorService = TestBed.inject(AccessorService);

  });

  it('should load innovation data with payload 01', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    accessorService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED' as keyof typeof INNOVATION_STATUS, description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      support: { id: '01', status: 'ENGAGED' as keyof typeof INNOVATION_SUPPORT_STATUS },
      assessment: { id: '01' },
      notifications: {}
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: { id: '01' },
      support: { id: '01', status: 'ENGAGED' }
    };

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });

  it('should load innovation data with payload 02', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    accessorService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED' as keyof typeof INNOVATION_STATUS, description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      notifications: {}
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: {},
      support: { status: 'UNASSIGNED' }
    };

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });

  it('should NOT load innovation data', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    accessorService.getInnovationInfo = () => throwError('error');

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toBe('error');

  });

});
