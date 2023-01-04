import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { AuthenticationService } from './authentication.service';
import { StoresModule } from '../stores.module';

describe('Stores/AuthenticationStore/AuthenticationService', () => {

  let httpMock: HttpTestingController;
  let envVaraiblesStore: EnvironmentVariablesStore;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    envVaraiblesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run verifyUserSession() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.verifyUserSession().subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVaraiblesStore.APP_URL}/session`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  // it('should run verifyUserSession() and return error', () => {

  //   const responseMock = '';
  //   let response: any = {};

  //   service.verifyUserSession().subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVaraiblesStore.APP_URL}/session`);
  //   httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

  //   expect(httpRequest.request.method).toBe('HEAD');
  //   expect(response.status).toBe(400);

  // });

  // it('should run getUserInfo() method and return success', () => {

  //   const responseMock = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', roles: [], organisations: [] };
  //   const expected = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', roles: [], organisations: [] };
  //   let response: any = null;

  //   service.getUserInfo().subscribe({ next: success => response = success, error: error => response = error});

  //   const httpRequest = httpMock.expectOne(`${envVaraiblesStore.API_URL}/me`);
  //   httpRequest.flush(responseMock);

  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

});
