import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { InnovatorService } from './innovator.service';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';


describe('FeatureModules/Innovator/InnovatorService', () => {

  let httpMock: HttpTestingController;

  let environmentStore: EnvironmentStore;
  let authenticationStore: AuthenticationStore;
  let service: InnovatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        InnovatorService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    service = TestBed.inject(InnovatorService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run submitFirstTimeSigninInfo(FIRST_TIME_SIGNIN, PayloadTest01) and return success', () => {

    const payload = {
      innovatorName: 'User display name',
      mobilePhone: '01010101',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      locationCountryName: 'Some location',
      // location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'no',
      // organisationName: 'Organisation name',
      // organisationSize: '1 to 5 workers',
      // organisationShares: ['Organisation 01']
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.submitFirstTimeSigninInfo('FIRST_TIME_SIGNIN', payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run submitFirstTimeSigninInfo(FIRST_TIME_SIGNIN, PayloadTest02) and return success', () => {

    const payload = {
      innovatorName: 'User display name',
      // mobilePhone: '01010101',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      // locationCountryName: 'Some location',
      location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'yes',
      organisationName: 'Organisation name',
      organisationSize: '1 to 5 workers',
      organisationShares: ['Organisation 01']
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.submitFirstTimeSigninInfo('FIRST_TIME_SIGNIN', payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run submitFirstTimeSigninInfo(TRANSFER, PayloadTest01) and return success', () => {

    const payload = {
      innovatorName: 'User display name',
      transferId: 'id',
      isCompanyOrOrganisation: 'NO',
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.submitFirstTimeSigninInfo('TRANSFER', payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run submitFirstTimeSigninInfo(INVALID, PayloadTest01) and return success', () => {

    const payload = {
      innovatorName: 'User display name',
      transferId: 'id',
      isCompanyOrOrganisation: 'NO',
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.submitFirstTimeSigninInfo('INVALID' as any, payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run createInnovation() and return success', () => {

    const payload = {
      name: 'User display name',
      description: 'Innovation name',
      countryName: 'Some location',
      postcode: 'EN05',
      organisationShares: ['Organisation 01']
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.createInnovation(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationInfo() and return success', () => {

    const payload = 'Inno01';
    const responseMock = { id: 'id', more: 'parameters' };
    const expected = { id: 'id', more: 'parameters' };

    let response: any = null;
    service.getInnovationInfo(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationSupports() and return success', () => {

    const responseMock = [
      {
        id: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
        status: 'ENGAGING',
        organisationUnit: {
          id: '4BB7433E-F36B-1410-8103-0032FE5B194B', name: 'Ratke Inc',
          organisation: { id: '43B7433E-F36B-1410-8103-0032FE5B194B', name: 'Reinger Inc', acronym: 'Group' }
        },
        accessors: [
          { id: '60CF433E-F36B-1410-8103-0032FE5B194B', name: 'ASHN Q. Accessor' },
          { id: '60CF433E-F36B-1410-8103-0032FE5B194C', name: 'ASHN Q. Accessor 2' }
        ]
      },
      {
        id: '52CF433E-F36B-1410-8103-0032FE5B194B',
        status: 'NOT_YET',
        organisationUnit: {
          id: '49CF433E-F36B-1410-8103-0032FE5B194B', name: 'Unit Test',
          organisation: { id: 'D1B7433E-F36B-1410-8103-0032FE5B194B', name: 'Kunde and Sons', acronym: 'LLC' }
        },
        accessors: [
          { id: '60CF433E-F36B-1410-8103-0032FE5B194C', name: 'ASHN Q. Accessor 3' }
        ]
      },
      {
        id: '59CF433E-F36B-1410-8103-0032FE5B194B',
        status: 'ENGAGING',
        organisationUnit: {
          id: '4BCF433E-F36B-1410-8103-0032FE5B194B', name: 'Second Unit',
          organisation: { id: '43B7433E-F36B-1410-8103-0032FE5B194B', name: 'Reinger Inc', acronym: 'Group' }
        },
        accessors: []
      }
    ];

    let response: any = null;
    service.getInnovationSupports('Inno01', true).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/supports?full=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response.length).toBe(3);

  });

  it('should run getInnovationActionsList() and return success', () => {

    const responseMock = [
      {
        id: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
        displayId: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
        status: 'CONTINUE',
        section: InnovationSectionsIds.INNOVATION_DESCRIPTION,
        createdAt: '2020-01-01T00:00:00.000Z',
        notifications: { count: 0 }
      },
      {
        id: '52CF433E-F36B-1410-8103-0032FE5B194B',
        displayId: '52CF433E-F36B-1410-8103-0032FE5B194B',
        status: 'STARTED',
        section: InnovationSectionsIds.INNOVATION_DESCRIPTION,
        createdAt: '2020-01-01T00:00:00.000Z',
        notifications: { count: 0 }
      },
      {
        id: '59CF433E-F36B-1410-8103-0032FE5B194B',
        displayId: '59CF433E-F36B-1410-8103-0032FE5B194B',
        status: 'COMPLETED',
        section: InnovationSectionsIds.INNOVATION_DESCRIPTION,
        createdAt: '2020-01-01T00:00:00.000Z',
        notifications: { count: 0 }
      }
    ];

    const expected = {
      openedActions: [
        { ...responseMock[0], name: 'Submit \'Description of innovation\'' },
        { ...responseMock[1], name: 'Submit \'Description of innovation\'' }
      ],
      closedActions: [
        { ...responseMock[2], name: 'Submit \'Description of innovation\'' }
      ]
    };

    let response: any = null;
    service.getInnovationActionsList('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationActionInfo() and return success', () => {

    const responseMock = {
      id: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
      displayId: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
      status: 'CONTINUE',
      description: '',
      section: InnovationSectionsIds.INNOVATION_DESCRIPTION,
      createdAt: '2020-01-01T00:00:00.000Z',
      createdBy: 'User Name'
    };

    const expected = {
      id: responseMock.id,
      displayId: responseMock.displayId,
      status: responseMock.status,
      name: `Submit 'description of innovation'`,
      description: responseMock.description,
      section: responseMock.section,
      createdAt: responseMock.createdAt
    };

    let response: any = null;
    service.getInnovationActionInfo('Inno01', 'ActionId01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/actions/ActionId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run declineAction() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.declineAction('Inno01', 'ActionId01', { some: 'parameters' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/actions/ActionId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationShares() and return success', () => {

    const responseMock = [
      { id: 'id', status: 'ENGAGING' },
      { id: 'id', status: 'WAITING' }
    ];
    const expected = responseMock;

    let response: any = null;
    service.getInnovationShares('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/shares`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run submitOrganisationSharing() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.submitOrganisationSharing('Inno01', { some: 'parameters' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/shares`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock = {
      id: 'AssessmentId01',
      innovation: { id: '01', name: 'Innovation 01' },
      description: 'description',
      maturityLevel: null,
      maturityLevelComment: null,
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
      organisations: [{ id: 'OrgId01', name: 'Organisation Name', acronym: 'ORG', organisationUnits: [{id: 'OrgId01', name: 'Organisation Unit Name', acronym: 'Unit' }] }],
      assignToName: '',
      finishedAt: null,
      updatedBy: null,
      updatedAt: null,
      createdAt: null,
      createdBy: null
    };

    const expected = {
      innovation: responseMock.innovation,
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
        organisations: responseMock.organisations.map(i => i.id),
        orgNames: responseMock.organisations.map(i => i.name),
        orgUnits: responseMock.organisations,
        assignToName: responseMock.assignToName,
        finishedAt: responseMock.finishedAt,
        updatedBy: null,
        updatedAt: null,
        createdAt: null,
        createdBy: null
      }
    };

    let response: any = null;
    service.getInnovationNeedsAssessment('Inno01', 'AssessmentId01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/assessments/AssessmentId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationTransfers() with NO parameter and return success', () => {

    const responseMock = [{
      id: 'transferId01', email: 'some@email.com', name: 'User name',
      innovation: { id: 'Inno01', name: 'Innovation name', owner: 'userId01' }
    }];
    const expected = responseMock;

    let response: any = null;
    service.getInnovationTransfers().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/innovation-transfers`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationTransfers() with assignToMe = true and return success', () => {

    const responseMock = [{
      id: 'transferId01', email: 'some@email.com', name: 'User name',
      innovation: { id: 'Inno01', name: 'Innovation name', owner: 'userId01' }
    }];
    const expected = responseMock;

    let response: any = null;
    service.getInnovationTransfers(true).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/innovation-transfers?assignedToMe=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run transferInnovation() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service.transferInnovation({ innovationId: 'Inno01', email: 'some@email.com' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/innovation-transfers`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateTransferInnovation() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service.updateTransferInnovation('transferId01', 'COMPLETED').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/innovation-transfers/transferId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run archiveInnovation() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service.archiveInnovation('Inno01', 'Some reason').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/innovations/Inno01/archive`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run deleteUserAccount() and return success', () => {

    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service.deleteUserAccount({ reason: 'Some reason'}).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/UserId01/delete`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

});
