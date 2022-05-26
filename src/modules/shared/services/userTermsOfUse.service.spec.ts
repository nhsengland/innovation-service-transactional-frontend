import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { UserTermsOfUseService } from './userTermsOfuse.service';

describe('Shared/Services/OrganisationsService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: UserTermsOfUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        UserTermsOfUseService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(UserTermsOfUseService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run userTermsOfUseInfo() and return success', () => {

    const responseMock = [{ id: 'id1', name: 'Organisation 01', summary: 'summary' }];
    const expected = [{ id: 'id1', name: 'Organisation 01', summary: 'summary' }];
    let response: any = null;

    service.userTermsOfUseInfo().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/tou/me`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
