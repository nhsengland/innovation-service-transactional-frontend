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

});
