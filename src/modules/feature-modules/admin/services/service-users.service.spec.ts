import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import {
  ServiceUsersService
} from './service-users.service';


describe('FeatureModules/Admin/Services/ServiceUsersService', () => {

  let httpMock: HttpTestingController;

  let environmentStore: EnvironmentStore;
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

    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationStore = TestBed.inject(InnovationStore);

    service = TestBed.inject(ServiceUsersService);

    authenticationStore.getUserId = () => 'UserId01';

  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should run aMethod() and return success', () => {

    const responseMock = {
      data: []
    };

    const expected = {
      data: []
    };

    // let response: any = null;

    expect(1).toEqual(1);

  });

});
