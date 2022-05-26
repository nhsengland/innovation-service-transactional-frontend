import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/shared/enums';

import { InnovationDataResolver } from './innovation-data.resolver';

import { AccessorService } from '../services/accessor.service';


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
      summary: {
        id: '01', name: 'Innovation 01', status: InnovationStatusEnum.CREATED, description: 'A description',
        company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: ''
      },
      contact: { name: 'A name' },
      support: { id: '01', status: InnovationSupportStatusEnum.ENGAGING },
      assessment: { id: '01' },
      notifications: {},
      lockedInnovatorValidation: { displayIsInnovatorLocked: false, innovatorName: 'test' }
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: { id: '01' },
      support: { id: '01', status: 'ENGAGING' },
      lockedInnovatorValidation: { displayIsInnovatorLocked: false, innovatorName: 'test' },
      owner: { isActive: true, name: 'test' }
    };

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });

  it('should load innovation data with payload 02', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    accessorService.getInnovationInfo = () => of({
      summary: {
        id: '01', name: 'Innovation 01', status: InnovationStatusEnum.CREATED, description: 'A description',
        company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: ''
      },
      contact: { name: 'A name' },
      notifications: {},
      lockedInnovatorValidation: { displayIsInnovatorLocked: true, innovatorName: 'test' }
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: { id: undefined },
      support: { status: 'UNASSIGNED' },
      lockedInnovatorValidation: { displayIsInnovatorLocked: true, innovatorName: 'test' },
      owner: { isActive: false, name: 'test' }
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
    expect(response).toBe(false);

  });

});
