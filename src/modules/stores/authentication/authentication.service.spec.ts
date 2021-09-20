import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationService } from './authentication.service';

describe('Stores/AuthenticationStore/AuthenticationService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run verifyUserSession() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  it('should run verifyUserSession() and return error', () => {

    const responseMock = '';
    let response: any = {};

    service.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('HEAD');
    expect(response.status).toBe(400);

  });

  it('should run getUserInfo() method and return success', () => {

    const responseMock = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] };
    const expected = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] };
    let response: any = null;

    service.getUserInfo().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/me`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run verifyInnovator() and return success', () => {

    const responseMock = { userExists: true, hasInvites: false };
    const expected = { userExists: true, hasInvites: false };
    let response: any = null;

    service.verifyInnovator('010101').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/check`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run verifyInnovator() and return error', () => {

    const responseMock = '';
    const expected = { userExists: false, hasInvites: false };
    let response: any = null;

    service.verifyInnovator('010101').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/check`);
    httpRequest.flush(responseMock, { status: 404, statusText: 'Not found' });
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovations() and return success', () => {

    const responseMock = [{ id: 'id', name: 'John Doe' }];
    const expected = [{ id: 'id', name: 'John Doe' }];
    let response: any = null;

    service.getInnovations('010101').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101/innovations`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovations() and return error', () => {

    const responseMock = '';
    const expected: any = [];
    let response: any = null;

    service.getInnovations('010101').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101/innovations`);
    httpRequest.flush(responseMock, { status: 404, statusText: 'Not found' });
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
