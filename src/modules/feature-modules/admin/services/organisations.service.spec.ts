import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { OrganisationsService, updateOrganisationDTO } from './organisations.service';


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


  it('should run updateOrganisation() and return SUCCESS', () => {

    const responseMock: updateOrganisationDTO = { organisationId: '_org01' };
    const expected = responseMock;

    let response: any = null;
    service.updateOrganisation({}, { id: 'slsId', code: 'slsCode' }, '_org01').subscribe({ next: success => response = success, error: error => response = error});

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_ADMIN_URL}/v1/organisations/_org01?id=slsId&code=slsCode`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });


  // it('should run updateOrganisation and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.updateOrganisation({}, { id: '', code: '' }, '_org01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation/_org01`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });


  // it('should run updateUnit() and return SUCCESS', () => {

  //   const responseMock: updateOrganisationDTO = { id: '_orgUnit01', status: 'OK' };
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.updateUnit({}, { id: 'slsId', code: 'slsCode' }, '_orgUnit01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation-units/_orgUnit01?id=slsId&code=slsCode`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run updateUnit and return ERROR, returning SLS object ID', () => {

  //   const responseMock = { id: 'errorId' };
  //   const expected = { id: 'errorId' };

  //   let response: any = null;
  //   service.updateUnit({}, { id: '', code: '' }, '_orgUnit01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisation-units/_orgUnit01`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run activateOrganisationUnit() and return SUCCESS', () => {

  //   const responseMock = true;
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.activateOrganisationUnit('_org01', '_orgUnit01', ['_user001']).subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/activate`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  // it('should run inactivateOrganisationUnit() and return SUCCESS', () => {

  //   const responseMock = true;
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.inactivateOrganisationUnit('_org01', '_orgUnit01').subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/organisations/_org01/units/_orgUnit01/inactivate`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });





});
