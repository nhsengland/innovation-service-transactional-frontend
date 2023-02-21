import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AdminOrganisationsService, updateOrganisationDTO } from './admin-organisations.service';


describe('FeatureModules/Admin/Services/OrganisationsService', () => {

  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: AdminOrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AdminOrganisationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(AdminOrganisationsService);

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

});
