import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationStatusEnum } from '@modules/stores/innovation';

import { AssessmentService, getSupportLogInDTO, getSupportLogOutDTO, SupportLogType } from './assessment.service';


describe('FeatureModules/Assessment/Services/AssessmentService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationStore: AuthenticationStore;

  let service: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationStore = TestBed.inject(AuthenticationStore);

    service = TestBed.inject(AssessmentService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getSupportLog() with type = "" and return success', () => {

    const responseMock: getSupportLogInDTO[] = [
      {
        id: 'support01',
        type: '' as any,
        description: 'description',
        createdBy: 'A user',
        createdAt: '2020-01-01T00:00:00.000Z',
        innovationSupportStatus: 'ENGAGING',
        organisationUnit: {
          id: 'unit01', name: 'Unit 01', acronym: 'UN',
          organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
        },
        suggestedOrganisationUnits: []
      }
    ];
    const expected: getSupportLogOutDTO[] = responseMock.map(item => ({
      ...item,
      logTitle: '',
      suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
    }));


    let response: any = null;
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSupportLog() with type = SupportLogType.ACCESSOR_SUGGESTION and return success', () => {

    const responseMock: getSupportLogInDTO[] = [
      {
        id: 'support01',
        type: SupportLogType.ACCESSOR_SUGGESTION,
        description: 'description',
        createdBy: 'A user',
        createdAt: '2020-01-01T00:00:00.000Z',
        innovationSupportStatus: 'ENGAGING',
        organisationUnit: {
          id: 'unit01', name: 'Unit 01', acronym: 'UN',
          organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
        },
        suggestedOrganisationUnits: [
          {
            id: 'unit01', name: 'Unit 01', acronym: 'UN',
            organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
          }
        ]
      }
    ];
    const expected: getSupportLogOutDTO[] = responseMock.map(item => ({
      ...item,
      logTitle: 'Suggested organisations',
      suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
    }));


    let response: any = null;
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSupportLog() with type = SupportLogType.STATUS_UPDATE and return success', () => {

    const responseMock: getSupportLogInDTO[] = [
      {
        id: 'support01',
        type: SupportLogType.STATUS_UPDATE,
        description: 'description',
        createdBy: 'A user',
        createdAt: '2020-01-01T00:00:00.000Z',
        innovationSupportStatus: 'ENGAGING',
        organisationUnit: {
          id: 'unit01', name: 'Unit 01', acronym: 'UN',
          organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
        }
      }
    ];
    const expected: getSupportLogOutDTO[] = responseMock.map(item => ({
      ...item,
      logTitle: 'Updated support status',
      suggestedOrganisationUnitsNames: []
    }));


    let response: any = null;
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run createInnovationNeedsAssessment() and return success', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.createInnovationNeedsAssessment('inno01', { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission true', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', true, { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission false', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', false, { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
