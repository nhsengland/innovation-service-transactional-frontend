import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector, signal } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, CtxStore } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { AssessmentService } from './assessment.service';

describe('FeatureModules/Assessment/Services/AssessmentService', () => {
  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let ctx: CtxStore;

  let service: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, StoresModule, AssessmentModule],
      providers: [{ provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    ctx = TestBed.inject(CtxStore);

    service = TestBed.inject(AssessmentService);

    ctx.user.getUserId = signal('UserId01');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run createInnovationNeedsAssessment() and return success', () => {
    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service
      .createInnovationNeedsAssessment('inno01', { some: 'data' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);
  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission true', () => {
    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service
      .updateInnovationNeedsAssessment('inno01', 'assess01', true, { some: 'data' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);
  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission false', () => {
    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service
      .updateInnovationNeedsAssessment('inno01', 'assess01', false, { some: 'data' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);
  });
});
