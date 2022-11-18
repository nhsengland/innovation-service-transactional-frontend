import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import {
  AccessorService,
  getSupportLogInDTO, SupportLogType, getSupportLogOutDTO
} from './accessor.service';
import { InnovationSectionEnum } from '@modules/stores/innovation';


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


  it('should run createAction() and return success', () => {

    const responseMock = { id: 'ID01' };
    const expected = responseMock;
    let response: any = null;

    service.createAction('Inno01', { section: InnovationSectionEnum.INNOVATION_DESCRIPTION, description: 'some description' }).subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/actions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
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
      logTitle: 'Suggested organisation units',
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
