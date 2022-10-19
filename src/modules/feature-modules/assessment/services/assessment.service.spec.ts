import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { TableModel } from '@app/base/models';

import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';

import {
  AssessmentService,
  getInnovationInfoEndpointDTO, GetInnovationNeedsAssessmentEndpointInDTO, GetInnovationNeedsAssessmentEndpointOutDTO, getInnovationsListEndpointInDTO,
  getInnovationsListEndpointOutDTO, getInnovationSupportsDTO, getSupportLogInDTO, getSupportLogOutDTO, SupportLogType
} from './assessment.service';


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


  it('should run getInnovationsList() and return success with NO filters', () => {

    const responseMock: getInnovationsListEndpointInDTO = { count: 0, overdue: 0, data: [] };
    const expected: getInnovationsListEndpointInDTO = { count: 0, overdue: 0, data: [] };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({});

    let response: any = null;
    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations?take=20&skip=0&status=`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationsList() and return success', () => {

    const responseMock: getInnovationsListEndpointInDTO = {
      count: 2,
      overdue: 1,
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
      overdue: 1,
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
    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations?take=20&skip=0&status=ASSESSMENT`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationInfo() and return success', () => {

    const responseMock: getInnovationInfoEndpointDTO = {
      summary: { id: '01', name: 'Innovation 01', status: InnovationStatusEnum.CREATED, description: 'A description', company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      lockedInnovatorValidation: { displayIsInnovatorLocked : false, innovatorName : 'test'}
    };

    const expected = responseMock;

    let response: any = null;
    service.getInnovationInfo('inno01').subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock: GetInnovationNeedsAssessmentEndpointInDTO = {
      id: 'Assess01',
      description: 'A description',
      maturityLevel: 'One value',
      maturityLevelComment: 'One value',
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
      suggestedOrganisations: [
        { id: 'org1', name: 'orgName', acronym: 'orgAcronym', units: [{ id: 'unit1', name: 'orgUnitName', acronym: 'orgUnitAcronym' }] }
      ],
      assignTo: { id: 'na01', name: 'One value'},
      finishedAt: 'One value',
      updatedAt: null,
      updatedBy: { id: 'na01', name: 'One value'}
    };

    const expected: GetInnovationNeedsAssessmentEndpointOutDTO = {
      assessment: {
        description: responseMock.description,
        maturityLevel: responseMock.maturityLevel,
        maturityLevelComment: responseMock.maturityLevelComment,
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
        suggestedOrganisations: responseMock.suggestedOrganisations,
        assignTo: responseMock.assignTo,
        finishedAt: responseMock.finishedAt,
        updatedAt: responseMock.updatedAt,
        updatedBy: responseMock.updatedBy,
        hasBeenSubmitted: !!responseMock.finishedAt
      }
    };

    let response: any = null;
    service.getInnovationNeedsAssessment('inno01', 'assess01').subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

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
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error});

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
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error});

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
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run createInnovationNeedsAssessment() and return success', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.createInnovationNeedsAssessment('inno01', { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission true', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', true, { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run updateInnovationNeedsAssessment() and return success with isSubmission false', () => {

    const responseMock = { id: 'Assess01' };
    const expected = responseMock;

    let response: any = null;
    service.updateInnovationNeedsAssessment('inno01', 'assess01', false, { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationSupports() and return success', () => {

    const responseMock: getInnovationSupportsDTO = {
      id: '01', status: InnovationSupportStatusEnum.ENGAGING,
      organisationUnit: {
        id: 'unit01', name: 'Unit 01',
        organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
      }
    };

    const expected = responseMock;

    let response: any = null;
    service.getInnovationSupports('inno01', false).subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/assessments/UserId01/innovations/inno01/supports?full=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
