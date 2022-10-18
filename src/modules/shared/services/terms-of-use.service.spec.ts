import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { GetTermsOfUseLastVersionInfoDTO, TermsOfUseService } from './terms-of-use.service';


describe('Shared/Services/TermsOfUseService', () => {

  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: TermsOfUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        TermsOfUseService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(TermsOfUseService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getTermsOfUseLastVersionInfo() and return success', () => {

    const responseMock: GetTermsOfUseLastVersionInfoDTO  = { id: 'id1', name: 'Organisation 01', summary: 'summary', releasedAt: new Date().toISOString(), isAccepted: true };
    const expected = responseMock;

    let response: any = null;
    service.getTermsOfUseLastVersionInfo().subscribe({ next: success => response = success, error: error => response = error});

    const req = httpMock.expectOne(`${envVariablesStore.API_USERS_URL}/v1/me/terms-of-use`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run acceptTermsOfUseVersion() and return success', () => {

    const responseMock  = { id: 'id1' };
    const expected = responseMock;

    let response: any = null;
    service.acceptTermsOfUseVersion('id1').subscribe({ next: success => response = success, error: error => response = error});

    const req = httpMock.expectOne(`${envVariablesStore.API_USERS_URL}/v1/me/terms-of-use/accept`);
    req.flush(responseMock);
    expect(req.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

});
