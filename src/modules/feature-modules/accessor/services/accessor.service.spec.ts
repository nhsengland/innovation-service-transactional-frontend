import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationActionStatusEnum, InnovationSectionEnum } from '@modules/stores/innovation';
import { TableModel } from '@app/base/models';

import {
  AccessorService,
  getActionsListEndpointInDTO, getActionsListEndpointOutDTO, getInnovationSupportsDTO,
  getSupportLogInDTO, SupportLogType, getSupportLogOutDTO
} from './accessor.service';


describe('FeatureModules/Accessor/Services/AccessorService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
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

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationStore = TestBed.inject(InnovationStore);

    service = TestBed.inject(AccessorService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should run getInnovationInfo() and return success', () => {

    const responseMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      support: { id: '01', status: 'WAITING' }
    };

    const expected = responseMock;
    let response: any = null;

    service.getInnovationInfo('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationActionsList() with payload 01 and return success', () => {

    const responseMock = [
      { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.REQUESTED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.STARTED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.COMPLETED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
      { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.CANCELLED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
    ];

    const expected = {
      openedActions: [
        { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.REQUESTED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
        { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.STARTED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
      ],
      closedActions: [
        { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.COMPLETED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' },
        { id: 'ID01', section: InnovationSectionEnum.COST_OF_INNOVATION, status: InnovationActionStatusEnum.CANCELLED, name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION)}'`, createdAt: '2021-04-16T09:23:49.396Z' }
      ]
    };

    let response: any = null;

    service.getInnovationActionsList('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationActionInfo() and return success', () => {

    const responseMock = {
      id: 'ID01',
      status: 'REQUESTED',
      description: 'some description',
      section: InnovationSectionEnum.COST_OF_INNOVATION,
      createdAt: '2021-04-16T09:23:49.396Z',
      createdBy: { id: 'user01', name: 'One guy name' }
    };

    const expected = {
      ...responseMock,
      ...{
        name: `Submit '${innovationStore.getSectionTitle(InnovationSectionEnum.COST_OF_INNOVATION).toLowerCase()}'`,
        createdBy: 'One guy name'
      }
    };

    let response: any = null;

    service.getInnovationActionInfo('Inno01', 'Inno01Action01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/actions/Inno01Action01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);


  });

  it('should run getActionsList() and return success', () => {

    const responseMock: getActionsListEndpointInDTO = {
      count: 2,
      data: [
        {
          id: '01', displayId: 'dId01', status: InnovationActionStatusEnum.REQUESTED, section: InnovationSectionEnum.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno01', name: 'Innovation 01' }
        },
        {
          id: '02', displayId: 'dId02', status: InnovationActionStatusEnum.STARTED, section: InnovationSectionEnum.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno02', name: 'Innovation 02' }
        }
      ]
    };

    const expected: getActionsListEndpointOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({ ...item, ...{ name: `Submit '${innovationStore.getSectionTitle(item.section)}'`, } }))
    };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ openActions: '' });

    let response: any = null;
    service.getActionsList(tableList.getAPIQueryParams()).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/actions?take=20&skip=0&openActions=`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getActionsList() with filters and return success', () => {

    const responseMock: getActionsListEndpointInDTO = { count: 0, data: [] };

    const expected: getActionsListEndpointOutDTO = { count: 0, data: [] };

    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({ openActions: 'true' });

    let response: any = null;
    service.getActionsList(tableList.getAPIQueryParams()).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/actions?take=20&skip=0&openActions=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run createAction() and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.createAction('Inno01', { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run updateAction() and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.updateAction('Inno01', 'Inno01Action01', { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/actions/Inno01Action01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });


  it('should run getInnovationSupportInfo() and return success', () => {

    const responseMock: { status: string, accessors: string[] } = {
      status: 'NeedsAssessment01',
      accessors: []
    };
    const expected: { status: string, accessors: string[] } = responseMock;

    let response: any = null;
    service.getInnovationSupportInfo('Inno01', 'SupportId01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/supports/SupportId01`);
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
    service.getAccessorsList().subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors`);
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
    service.getInnovationSupports('Inno01', false).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/supports?full=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run saveSupportStatus() WITHOUT a supportId and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.saveSupportStatus('Inno01', { some: 'data' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/supports`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run saveSupportStatus() WITH a supportId and return success', () => {

    const responseMock = { id: 'Inno01Support01' };
    const expected = responseMock;
    let response: any = null;

    service.saveSupportStatus('Inno01', { some: 'data' }, 'Inno01Support01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/supports/Inno01Support01`);
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
    service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
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

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
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

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run suggestNewOrganisations() and return success', () => {

    const responseMock = { id: 'id01' };
    const expected = responseMock;
    let response: any = null;

    service.suggestNewOrganisations('Inno01', { organisationUnits: [], type: SupportLogType.STATUS_UPDATE, description: '' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

});
