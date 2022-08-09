import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { OrganisationsService } from './organisations.service';

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


  // TODO: Add tests.
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
