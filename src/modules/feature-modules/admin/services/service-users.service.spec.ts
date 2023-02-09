import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';


import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { getUserMinimalInfoDTO, ServiceUsersService } from './service-users.service';


describe('FeatureModules/Admin/Services/ServiceUsersService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationStore: AuthenticationStore;

  let service: ServiceUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationStore = TestBed.inject(AuthenticationStore);

    service = TestBed.inject(ServiceUsersService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getUserMinimalInfo() and return SUCCESS', () => {

    const responseMock: getUserMinimalInfoDTO = { id: '_user01', displayName: 'User name 01' };
    const expected = responseMock;

    let response: any = null;
    service.getUserMinimalInfo('_user01').subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_USERS_URL}/v1/_user01?model=minimal`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  // it('should run getUserFullInfo() and return SUCCESS', () => {

  //   const responseMock: getUserFullInfoDTO = {
  //     id: '_id',
  //     email: 'some@email.com',
  //     displayName: 'Test innovator',
  //     type: UserRoleEnum.INNOVATOR,
  //     phone: '212000000',
  //     lockedAt: null,
  //     innovations: [],
  //     userOrganisations: []
  //   };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.getUserFullInfo('_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01?model=full`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run getLockUserRules() and return SUCCESS', () => {

  //   const responseMock: getLockUserRulesInDTO = {
  //     lastAssessmentUserOnPlatform: { valid: true },
  //     lastAccessorUserOnOrganisation: { valid: true },
  //     lastAccessorUserOnOrganisationUnit: { valid: true },
  //     lastAccessorFromUnitProvidingSupport: { valid: true },
  //   };
  //   const expected = Object.entries(responseMock).map(([key, item]) => ({ key, valid: item.valid, meta: item.meta || {} }));

  //   let response: any = null;
  //   service.getLockUserRules('_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/lock`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run lockUser() and return SUCCESS', () => {

  //   const responseMock: lockUserEndpointDTO = { id: '_user01', status: 'OK' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.lockUser('_user01', { id: 'slsId', code: 'slsCode' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/lock?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run lockUser() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.lockUser('_user01', { id: '', code: '' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/lock`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run unlockUser() and return SUCCESS', () => {

  //   const responseMock: lockUserEndpointDTO = { id: '_user01', status: 'OK' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.unlockUser('_user01', { id: 'slsId', code: 'slsCode' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/unlock?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run unlockUser() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.unlockUser('_user01', { id: '', code: '' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/unlock`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run createUser() and return SUCCESS', () => {

  //   const responseMock = { id: '_user01' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.createUser({}, { id: 'slsId', code: 'slsCode' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/user?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('POST');
  //   expect(response).toEqual(expected);

  // });

  // it('should run createUser() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.createUser({}, { id: '', code: '' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/user`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('POST');
  //   expect(response).toEqual(expected);

  // });


  // it('should run deleteAdminAccount() and return SUCCESS', () => {

  //   const responseMock = { id: '_user01' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.deleteAdminAccount('_user01', { id: 'slsId', code: 'slsCode' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/_user01/delete?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run deleteAdminAccount() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.deleteAdminAccount('_user01', { id: '', code: '' }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/_user01/delete`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run searchUser() and return SUCCESS', () => {

  //   const responseMock: searchUserEndpointInDTO[] = [{
  //     id: '_id',
  //     email: 'some@email.com',
  //     displayName: 'Test innovator',
  //     type: UserRoleEnum.INNOVATOR
  //   }];
  //   const expected = responseMock.map(item => ({ ...item, typeLabel: 'Innovator' }));

  //   let response: any = null;
  //   service.searchUser('some@email.com', true).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users?email=some@email.com&isAdmin=true`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });


  // it('should run searchUser() and return SUCCESS', () => {

  //   const responseMock: searchUserEndpointInDTO[] = [{
  //     id: '_id',
  //     email: 'some@email.com',
  //     displayName: 'Test innovator',
  //     type: UserRoleEnum.INNOVATOR
  //   }];
  //   const expected = responseMock.map(item => ({ ...item, typeLabel: 'Innovator' }));

  //   let response: any = null;
  //   service.searchUser('some@email.com', true).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users?email=some@email.com&isAdmin=true`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run getUserRoleRules() and return SUCCESS', () => {

  //   const responseMock: getOrgnisationRoleRulesInDTO = {
  //     lastAccessorUserOnOrganisationUnit: { valid: true }
  //   };
  //   const expected = Object.entries(responseMock).map(([key, item]) => ({ key, valid: item.valid, meta: item.meta || {} }));

  //   let response: any = null;
  //   service.getUserRoleRules('_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-role`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run changeUserRole() and return SUCCESS', () => {

  //   const responseMock = { id: '_user01' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.changeUserRole({
  //     userId: '_user01', role: AccessorOrganisationRoleEnum.ACCESSOR,
  //     securityConfirmation: { id: 'slsId', code: 'slsCode' }
  //   }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-role?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run changeUserRole() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.changeUserRole({
  //     userId: '_user01', role: AccessorOrganisationRoleEnum.ACCESSOR,
  //     securityConfirmation: { id: '', code: '' }
  //   }).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-role`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run changeOrganisationUserUnit() and return SUCCESS', () => {

  //   const responseMock = { id: '_user01' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.changeOrganisationUserUnit({}, { id: 'slsId', code: 'slsCode' }, '_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-unit?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run changeOrganisationUserUnit() and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.changeOrganisationUserUnit({}, { id: '', code: '' }, '_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-unit`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run getOrgnisationUnitRules() and return SUCCESS', () => {

  //   const responseMock: getOrganisationUnitRulesInDTO = {
  //     lastAccessorUserOnOrganisation: { valid: true },
  //     lastAccessorFromUnitProvidingSupport: { valid: true },
  //     lastAccessorUserOnOrganisationUnit: { valid: true }
  //   };
  //   const expected = Object.entries(responseMock).map(([key, item]) => ({ key, valid: item.valid, meta: item.meta || {} }));

  //   let response: any = null;
  //   service.getOrgnisationUnitRules('_user01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01/change-unit`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });


  // it('should run getListOfTerms() and return SUCCESS', () => {

  //   const tableList = new TableModel<{}, {}>();

  //   const responseMock: getListOfTerms = {
  //     count: 20,
  //     data: [{
  //       id: '', name: '', summary: '', touType: '', createdAt: ''
  //     }]
  //   };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.getListOfTerms(tableList.getAPIQueryParams()).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/tou?take=20&skip=0&filters=%7B%7D`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });


  // it('should run createVersion() and return SUCCESS', () => {

  //   const responseMock = { id: '_user01' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.createVersion({}).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/tou`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('POST');
  //   expect(response).toEqual(expected);

  // });

  // it('should run createVersion() and return ERROR', () => {

  //   const responseMock = { error: 'errorId' };
  //   const expected = { code: 'errorId' };

  //   let response: any = null;
  //   service.createVersion({}).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/tou`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('POST');
  //   expect(response).toEqual(expected);

  // });

});
