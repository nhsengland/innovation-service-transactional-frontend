import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { AssessmentService } from '../services/assessment.service';

import { InnovationDataResolver } from './innovation-data.resolver';

import { INNOVATION_STATUS } from '@modules/stores/innovation/innovation.models';


describe('FeatureModules/Assessment/Resolvers/InnovationDataResolver', () => {

  let resolver: InnovationDataResolver;

  let assessmentService: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    resolver = TestBed.inject(InnovationDataResolver);

    assessmentService = TestBed.inject(AssessmentService);

  });


  it('should load innovation data with payload 01', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    assessmentService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED' as keyof typeof INNOVATION_STATUS, description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: { id: '01' }
    };

    let response: any = null;
    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });

  it('should load innovation data with payload 02', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    assessmentService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED' as keyof typeof INNOVATION_STATUS, description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      // assessment: { id: '01', assignToName: 'Name' }
    });

    const expected = {
      id: '01',
      name: 'Innovation 01',
      status: 'CREATED',
      assessment: {}
    };

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });


  it('should NOT load innovation data', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { innovationId: 'Inno01' } };

    assessmentService.getInnovationInfo = () => throwError('error');

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toBe('error');

  });


});
