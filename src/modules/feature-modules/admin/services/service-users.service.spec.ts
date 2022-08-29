import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { getUserMinimalInfoDTO, ServiceUsersService } from './service-users.service';


describe('FeatureModules/Admin/Services/ServiceUsersService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationStore: AuthenticationStore;
  let innovationStore: InnovationStore;

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
    innovationStore = TestBed.inject(InnovationStore);

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
    service.getUserMinimalInfo('_user01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/user-admin/users/_user01?model=minimal`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
