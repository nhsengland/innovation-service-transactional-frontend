import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';
import { TableModel } from '@app/base/models';

import {
  AccessorService,
  getActionsListEndpointInDTO, getActionsListEndpointOutDTO,
  getInnovationNeedsAssessmentEndpointOutDTO, getInnovationsListEndpointInDTO, getInnovationsListEndpointOutDTO, getInnovationNeedsAssessmentEndpointInDTO, getInnovationSupportsDTO,
  getSupportLogInDTO, SupportLogType, getSupportLogOutDTO
} from './accessor.service';


describe('FeatureModules/Accessor/Services/AccessorService', () => {

  let httpMock: HttpTestingController;

  let environmentStore: EnvironmentStore;
  let authenticationStore: AuthenticationStore;
  let innovationStore: InnovationStore;

  let service: AccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationStore = TestBed.inject(InnovationStore);

    service = TestBed.inject(AccessorService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationsList() and return success', () => {

    const responseMock: getInnovationsListEndpointInDTO = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', mainCategory: 'MEDICAL_DEVICE', otherMainCategoryDescription: '', countryName: 'England', postcode: 'SW01', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S01', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: [],
          assessment: { id: '01' }
        },
        {
          id: '02', name: 'Innovation 02', mainCategory: 'MEDICAL_DEVICE', otherMainCategoryDescription: 'Other main category', countryName: 'England', postcode: '', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S02', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: [],
          assessment: { id: '02' },
        },
        {
          id: '03', name: 'Innovation 03', mainCategory: 'INVALID_CATEGORY', otherMainCategoryDescription: '', countryName: 'England', postcode: '', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S03', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: [],
          assessment: { id: '03' },
        }
      ]
    };

    const expected: getInnovationsListEndpointOutDTO = {
      count: responseMock.count,
      data: [
        {
          id: '01', name: 'Innovation 01', mainCategory: 'Medical device', countryName: 'England, SW01', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S01', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: responseMock.data[0].organisations,
          assessment: { id: '01' }
        },
        {
          id: '02', name: 'Innovation 02', mainCategory: 'Other main category', countryName: 'England', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S02', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: responseMock.data[0].organisations,
          assessment: { id: '02' },
        },
        {
          id: '03', name: 'Innovation 03', mainCategory: '', countryName: 'England', submittedAt: '2021-04-16T09:23:49.396Z',
          support: { id: 'S03', status: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396', accessors: [] },
          organisations: responseMock.data[0].organisations,
          assessment: { id: '03' },
        }
      ]
    };

    let response: any = null;

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ status: 'UNASSIGNED' });

    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations?take=10&skip=0&supportStatus=UNASSIGNED&assignedToMe=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationInfo() and return success', () => {

    const responseMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      support: { id: '01', status: 'WAITING' }
    };

    const expected = responseMock;
    let response: any = null;

    service.getInnovationInfo('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationActionsList() with payload 01 and return success', () => {

    const responseMock = [
      { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'REQUESTED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'STARTED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
    ];

    const expected = {
      openedActions: [
        { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'REQUESTED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
        { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'STARTED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
      ],
      closedActions: [
        { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
        { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
      ]
    };

    let response: any = null;

    service.getInnovationActionsList('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationActionInfo() and return success', () => {

    const responseMock = {
      id: 'ID01',
      status: 'REQUESTED',
      description: 'some description',
      section: InnovationSectionsIds.COST_OF_INNOVATION,
      createdAt: '2021-04-16T09:23:49.396Z',
      createdBy: { id: 'user01', name: 'One guy name' }
    };

    const expected = {
      ...responseMock,
      ...{
        name: `Submit '${innovationStore.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION).toLowerCase()}'`,
        createdBy: 'One guy name'
      }
    };

    let response: any = null;

    service.getInnovationActionInfo('Inno01', 'Inno01Action01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/actions/Inno01Action01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);


  });

  it('should run getActionsList() with filters and return success', () => {

    const responseMock: getActionsListEndpointInDTO = {
      count: 2,
      data: [
        {
          id: '01', displayId: 'dId01', status: 'REQUESTED', section: InnovationSectionsIds.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno01', name: 'Innovation 01' }
        },
        {
          id: '02', displayId: 'dId02', status: 'STARTED', section: InnovationSectionsIds.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno02', name: 'Innovation 02' }
        }
      ]
    };

    const expected: getActionsListEndpointOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({ ...item, ...{ name: `Submit '${innovationStore.getSectionTitle(item.section)}'`, } }))
    };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ openActions: 'true' });

    let response: any = null;
    service.getActionsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/actions?take=10&skip=0&openActions=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run createAction() and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.createAction('Inno01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateAction() and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.updateAction('Inno01', 'Inno01Action01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/actions/Inno01Action01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock: getInnovationNeedsAssessmentEndpointInDTO = {
      id: 'NeedsAssessment01',
      innovation: { id: 'Inno01', name: 'Innovation name' },
      description: null,
      maturityLevel: null,
      hasRegulatoryApprovals: null,
      hasRegulatoryApprovalsComment: null,
      hasEvidence: null,
      hasEvidenceComment: null,
      hasValidation: null,
      hasValidationComment: null,
      hasProposition: null,
      hasPropositionComment: null,
      hasCompetitionKnowledge: null,
      hasCompetitionKnowledgeComment: null,
      hasImplementationPlan: null,
      hasImplementationPlanComment: null,
      hasScaleResource: null,
      hasScaleResourceComment: null,
      summary: null,
      organisations: [],
      assignToName: 'Name of user',
      finishedAt: '2020-01-01T00:00:00.000Z',
      support: { id: null }
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
        finishedAt: responseMock.finishedAt
      },
      support: responseMock.support

    };

    let response: any = null;
    service.getInnovationNeedsAssessment('Inno01', 'NeedsAssessment01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/assessments/NeedsAssessment01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationSupportInfo() and return success', () => {

    const responseMock: { status: string, accessors: string[] } = {
      status: 'NeedsAssessment01',
      accessors: []
    };
    const expected: { status: string, accessors: string[] } = responseMock;

    let response: any = null;
    service.getInnovationSupportInfo('Inno01', 'SupportId01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/supports/SupportId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getAccessorsList() and return success', () => {

    const responseMock: { id: string, name: string }[] = [
      { id: '01', name: 'Name 01' },
      { id: '02', name: 'Name 02' }
    ];
    const expected: { id: string, name: string }[] = responseMock;

    let response: any = null;
    service.getAccessorsList().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationSupports() and return success', () => {

    const responseMock: getInnovationSupportsDTO = {
      id: 'supportId01',
      status: 'ENGAGING',
      organisationUnit: {
        id: 'Unit01',
        name: 'Organisation unit 01',
        organisation: {
          id: 'Organisation01',
          name: 'Organisation 01',
          acronym: 'ORG'
        },
      },
      accessors: [],
      notifications: {}
    };
    const expected: getInnovationSupportsDTO = responseMock;

    let response: any = null;
    service.getInnovationSupports('Inno01', false).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/supports?full=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run saveSupportStatus() WITHOUT a supportId and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.saveSupportStatus('Inno01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/supports`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run saveSupportStatus() WITH a supportId and return success', () => {

    const responseMock = { id: 'Inno01Support01' };
    const expected = responseMock;
    let response: any = null;

    service.saveSupportStatus('Inno01', { some: 'data' }, 'Inno01Support01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/supports/Inno01Support01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
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
    service.getSupportLog('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
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
    service.getSupportLog('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
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
    service.getSupportLog('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run suggestNewOrganisations() and return success', () => {

    const responseMock = { id: 'id01' };
    const expected = responseMock;
    let response: any = null;

    service.suggestNewOrganisations('Inno01', { organisationUnits: [], type: SupportLogType.STATUS_UPDATE, description: '' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

});
