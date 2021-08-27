import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { AccessorService } from '../services/accessor.service';

import { InnovationDataResolver } from './innovation-data.resolver';


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


  it('should load innovation data', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    const responseMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      support: { id: '01', status: 'ENGAGED' },
      assessment: { id: '01', assignToName: 'Name' }
    };
    accessorService.getInnovationInfo = () => of(responseMock as any);

    let response: any = null;
    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: { id: '01' },
      support: { id: '01', status: 'ENGAGED' }
    };

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
