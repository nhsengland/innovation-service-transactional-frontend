import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { GetOrganisationInfoDTO, GetOrganisationsListDTO, GetOrganisationUnitInfoDTO, GetOrganisationUnitInnovationsListDTO, GetOrganisationUnitUsersInDTO, GetOrganisationUnitUsersOutDTO, OrganisationsService, updateOrganisationDTO } from './organisations.service';
import { TableModel } from '@app/base/models';
import { AccessorOrganisationRoleEnum } from '@app/base/enums';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


describe('FeatureModules/Admin/Services/OrganisationsService', () => {

  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        OrganisationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(OrganisationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run getOrganisationsList() and return SUCCESS', () => {

    const responseMock: GetOrganisationsListDTO[] = [{
      id: '_org01', name: ' Org name 01', acronym: 'ORG01', isActive: true,
      organisationUnits: [{ id: '_orgUnitd01', name: 'Org unit name 01', acronym: 'ORGu01', isActive: true }]
    }];
    const expected = responseMock;

    let response: any = null;
    service.getOrganisationsList({ onlyActive: true }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations?onlyActive=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getOrganisationInfo() and return SUCCESS', () => {

    const responseMock: GetOrganisationInfoDTO = {
      id: '_org01', name: ' Org name 01', acronym: 'ORG01', isActive: true,
      organisationUnits: [{ id: '_orgUnitd01', name: 'Org unit name 01', acronym: 'ORGu01', isActive: true, userCount: 10 }]
    };
    const expected = responseMock;

    let response: any = null;
    service.getOrganisationInfo('_org01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run updateOrganisation() and return SUCCESS', () => {

    const responseMock: updateOrganisationDTO = { id: '_org01', status: 'OK' };
    const expected = responseMock;

    let response: any = null;
    service.updateOrganisation({}, { id: 'slsId', code: 'slsCode' }, '_org01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation/_org01?id=slsId&code=slsCode`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });


  it('should run updateOrganisation and return ERROR, returning SLS object ID', () => {

    const responseMock = { id: 'errorId' };
    const expected = { id: 'errorId' };

    let response: any = null;
    service.updateOrganisation({}, { id: '', code: '' }, '_org01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation/_org01`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run getOrganisationUnitInfo() and return SUCCESS', () => {

    const responseMock: GetOrganisationUnitInfoDTO = { id: '_org01', name: ' Org name 01', acronym: 'ORG01', isActive: true, userCount: 10 };
    const expected = responseMock;

    let response: any = null;
    service.getOrganisationUnitInfo('_org01', '_orgUnit01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getOrganisationUnitUsers() and return SUCCESS', () => {

    let tableList: TableModel<{}, { onlyActive: boolean }>;
    let httpRequest: TestRequest;
    let response: any = null;

    const responseMock: GetOrganisationUnitUsersInDTO = {
      count: 50,
      data: [
        {
          id: 'Id01', name: 'User name 01', email: 'user01@email.com',
          organisationRole: AccessorOrganisationRoleEnum.ACCESSOR,
          isActive: true, lockedAt: '2020-01-01T00:00:00.000Z'
        },
        {
          id: 'Id02', name: 'User name 02', email: 'user02@email.com',
          organisationRole: AccessorOrganisationRoleEnum.ACCESSOR,
          isActive: true, lockedAt: '2020-01-01T00:00:00.000Z'
        }
      ]
    };
    const expected: GetOrganisationUnitUsersOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({ ...item, organisationRoleDescription: 'Accessor' }))
    };

    // Query params v1.
    tableList = new TableModel<{}, { onlyActive: boolean }>().setFilters({ onlyActive: true });
    service.getOrganisationUnitUsers('_org01', '_orgUnit01', tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);
    httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/users?take=20&skip=0&onlyActive=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

    // Query params v2.
    tableList = new TableModel<{}, { onlyActive: boolean }>().setFilters({ onlyActive: false });
    service.getOrganisationUnitUsers('_org01', '_orgUnit01', tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);
    httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/users?take=20&skip=0&onlyActive=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getOrganisationUnitInnovationsList() and return SUCCESS', () => {

    let tableList: TableModel<{}, { onlyOpen: boolean }>;
    let httpRequest: TestRequest;
    let response: any = null;

    const responseMock: GetOrganisationUnitInnovationsListDTO = {
      count: 50,

      innovationsByStatus: [
        { status: InnovationSupportStatusEnum.ENGAGING, count: 20 },
        { status: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED, count: 40 }
      ],
      innovationsList: [
        { id: 'Inno01', name: 'Innovation 01', status: InnovationSupportStatusEnum.ENGAGING },
        { id: 'Inno02', name: 'Innovation 02', status: InnovationSupportStatusEnum.COMPLETE }
      ]
    };
    const expected = responseMock;

    // Query params v1.
    tableList = new TableModel<{}, { onlyOpen: boolean }>().setFilters({ onlyOpen: true });
    service.getOrganisationUnitInnovationsList('_org01', '_orgUnit01', tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);
    httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/innovations?take=20&skip=0&onlyOpen=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

    // Query params v2.
    tableList = new TableModel<{}, { onlyOpen: boolean }>().setFilters({ onlyOpen: false });
    service.getOrganisationUnitInnovationsList('_org01', '_orgUnit01', tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);
    httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/innovations?take=20&skip=0&onlyOpen=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run updateUnit() and return SUCCESS', () => {

    const responseMock: updateOrganisationDTO = { id: '_orgUnit01', status: 'OK' };
    const expected = responseMock;

    let response: any = null;
    service.updateUnit({}, { id: 'slsId', code: 'slsCode' }, '_orgUnit01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation-units/_orgUnit01?id=slsId&code=slsCode`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run updateUnit and return ERROR, returning SLS object ID', () => {

    const responseMock = { id: 'errorId' };
    const expected = { id: 'errorId' };

    let response: any = null;
    service.updateUnit({}, { id: '', code: '' }, '_orgUnit01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation-units/_orgUnit01`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run activateOrganisationUnit() and return SUCCESS', () => {

    const responseMock = true;
    const expected = responseMock;

    let response: any = null;
    service.activateOrganisationUnit('_org01', '_orgUnit01', ['_user001']).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/activate`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run inactivateOrganisationUnit() and return SUCCESS', () => {

    const responseMock = true;
    const expected = responseMock;

    let response: any = null;
    service.inactivateOrganisationUnit('_org01', '_orgUnit01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/inactivate`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });





});
