import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TableModel } from '@app/base/models';

import { AssessmentService } from './assessment.service';

describe('FeatureModules/Assessment/Services/AssessmentService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AssessmentService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AssessmentService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationsList() and return success', () => {

    const responseMock = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'MEDICAL_DEVICE', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'MEDICAL_DEVICE', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        }
      ]
    };
    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ status: ['ASSESSMENT'] });

    const expected = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical device', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01'],
          isOverdue: true
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical device', submittedAt: '2020-01-01T00:00:00.000Z',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01'],
          isOverdue: true
        }
      ]
    };
    let response: any = null;

    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations?take=10&skip=0&status=ASSESSMENT`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationInfo() and return success', () => {

    const responseMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };

    const expected = responseMock;
    let response: any = null;

    service.getInnovationInfo('inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations/inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock = {
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
      organisations: [{ id: 'org1', name: 'orgName', acronym: 'orgAcronym' }],
      assignToName: 'One value',
      finishedAt: 'One value'
    };

    const expected = {
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
        organisations: ['orgName'],
        assignToName: 'One value',
        finishedAt: 'One value'
      }
    };

    let response: any = null;

    service.getInnovationNeedsAssessment('inno01', 'assess01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run createInnovationNeedsAssessment() and return success', () => {

    const responseMock = { id: 'Assess01' };

    const expected = responseMock;
    let response: any = null;

    service.createInnovationNeedsAssessment('inno01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations/inno01/assessments`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission true', () => {

    const responseMock = { id: 'Assess01' };

    const expected = responseMock;
    let response: any = null;

    service.updateInnovationNeedsAssessment('inno01', 'assess01', true, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission false', () => {

    const responseMock = { id: 'Assess01' };

    const expected = responseMock;
    let response: any = null;

    service.updateInnovationNeedsAssessment('inno01', 'assess01', false, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
