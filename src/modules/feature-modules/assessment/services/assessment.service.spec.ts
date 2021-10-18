import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { TableModel } from '@app/base/models';

import { AssessmentService, getInnovationInfoEndpointDTO, getInnovationNeedsAssessmentEndpointInDTO, getInnovationNeedsAssessmentEndpointOutDTO, getInnovationsListEndpointInDTO, getInnovationsListEndpointOutDTO } from './assessment.service';

describe('FeatureModules/Assessment/Services/AssessmentService', () => {

  let httpMock: HttpTestingController;

  let environmentStore: EnvironmentStore;
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

    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationStore = TestBed.inject(AuthenticationStore);

    service = TestBed.inject(AssessmentService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationsList() and return success with NO filters', () => {

    const responseMock = { count: 0, data: [] };
    const expected = { count: 0, data: [] };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({});

    let response: any = null;
    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations?take=20&skip=0&status=`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationsList() and return success', () => {

    const responseMock: getInnovationsListEndpointInDTO = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'MEDICAL_DEVICE', otherMainCategoryDescription: '', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment01', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01'],
          notifications: { count: 0, isNew: false }
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'OTHER', otherMainCategoryDescription: 'Other category', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment02', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 02'],
          notifications: { count: 0, isNew: false }
        },
        {
          id: '03', name: 'Innovation 03', countryName: 'England', postCode: 'SW01', mainCategory: 'INVALID_CATEGORY', otherMainCategoryDescription: '', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment03', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 03'],
          notifications: { count: 0, isNew: false }
        }
      ]
    };

    const expected: getInnovationsListEndpointOutDTO = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical device', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment01', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01'],
          notifications: { count: 0, isNew: false },
          isOverdue: true
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'Other category', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment02', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 02'],
          notifications: { count: 0, isNew: false },
          isOverdue: true
        },
        {
          id: '03', name: 'Innovation 03', countryName: 'England', postCode: 'SW01', mainCategory: '', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { id: 'Assessment03', createdAt: '2021-04-16T09:23:49.396Z', assignTo: { name: 'User Name' }, finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 03'],
          notifications: { count: 0, isNew: false },
          isOverdue: true
        }
      ]
    };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ status: ['ASSESSMENT'] });

    let response: any = null;
    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations?take=20&skip=0&status=ASSESSMENT`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationInfo() and return success', () => {

    const responseMock: getInnovationInfoEndpointDTO = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };

    const expected = responseMock;

    let response: any = null;
    service.getInnovationInfo('inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations/inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock: getInnovationNeedsAssessmentEndpointInDTO = {
      id: 'Assess01',
      innovation: { id: 'Innov01', name: 'Innovation 01' },
      description: 'A description',
      maturityLevel: 'One value',
      hasRegulatoryApprovals: 'One value',
      hasRegulatoryApprovalsComment: 'One value',
      hasEvidence: 'One value',
      hasEvidenceComment: 'One value',
      hasValidation: 'One value',
      hasValidationComment: 'One value',
      hasProposition: 'One value',
      hasPropositionComment: 'One value',
      hasCompetitionKnowledge: 'One value',
      hasCompetitionKnowledgeComment: 'One value',
      hasImplementationPlan: 'One value',
      hasImplementationPlanComment: 'One value',
      hasScaleResource: 'One value',
      hasScaleResourceComment: 'One value',
      summary: 'One value',
      organisations: [
        { id: 'org1', name: 'orgName', acronym: 'orgAcronym', organisationUnits: [{ id: 'unit1', name: 'orgUnitName', acronym: 'orgUnitAcronym' }] }
      ],
      assignToName: 'One value',
      finishedAt: 'One value',
      createdAt: '2020-01-01T00:00:00.000Z',
      createdBy: ' A user',
      updatedAt: null,
      updatedBy: null
    };

    const expected: getInnovationNeedsAssessmentEndpointOutDTO = {
      innovation: responseMock.innovation,
      assessment: {
        description: responseMock.description,
        maturityLevel: responseMock.maturityLevel,
        hasRegulatoryApprovals: responseMock.hasRegulatoryApprovals,
        hasRegulatoryApprovalsComment: responseMock.hasRegulatoryApprovalsComment,
        hasEvidence: responseMock.hasEvidence,
        hasEvidenceComment: responseMock.hasEvidenceComment,
        hasValidation: responseMock.hasValidation,
        hasValidationComment: responseMock.hasValidationComment,
        hasProposition: responseMock.hasProposition,
        hasPropositionComment: responseMock.hasPropositionComment,
        hasCompetitionKnowledge: responseMock.hasCompetitionKnowledge,
        hasCompetitionKnowledgeComment: responseMock.hasCompetitionKnowledgeComment,
        hasImplementationPlan: responseMock.hasImplementationPlan,
        hasImplementationPlanComment: responseMock.hasImplementationPlanComment,
        hasScaleResource: responseMock.hasScaleResource,
        hasScaleResourceComment: responseMock.hasScaleResourceComment,
        summary: responseMock.summary,
        organisations: responseMock.organisations,
        assignToName: responseMock.assignToName,
        finishedAt: responseMock.finishedAt,
        createdAt: responseMock.createdAt,
        createdBy: responseMock.createdBy,
        updatedAt: responseMock.updatedAt,
        updatedBy: responseMock.updatedBy,
        hasBeenSubmitted: !!responseMock.finishedAt
      }
    };

    let response: any = null;
    service.getInnovationNeedsAssessment('inno01', 'assess01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run createInnovationNeedsAssessment() and return success', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.createInnovationNeedsAssessment('inno01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations/inno01/assessments`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission true', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', true, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission false', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', false, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments/UserId01/innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
