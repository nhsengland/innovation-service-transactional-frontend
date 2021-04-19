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

    const req = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    req.flush(responseMock);

    expect(req.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  it('should run verifyUserSession() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.verifyUserSession().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    req.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(req.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  it('should run getUserInfo() method and return success', () => {

    const responseMock = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] };
    const expected = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] };
    let response: any = null;

    service.getUserInfo().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/me`);
    req.flush(responseMock);

    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run verifyInnovator() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.verifyInnovator('010101').subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101`);
    req.flush(responseMock);
    expect(req.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  it('should run verifyInnovator() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = null;

    service.verifyInnovator('010101').subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101`);
    req.flush(responseMock, { status: 404, statusText: 'Not found' });
    expect(req.request.method).toBe('HEAD');
    expect(response).toBe(expected);

  });

  it('should run getInnovations() and return success', () => {

    const responseMock = [{ id: 'id', name: 'John Doe' }];
    const expected = [{ id: 'id', name: 'John Doe' }];
    let response: any = null;

    service.getInnovations('010101').subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101/innovations`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovations() and return error', () => {

    const responseMock = '';
    const expected: any = [];
    let response: any = null;

    service.getInnovations('010101').subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/innovators/010101/innovations`);
    req.flush(responseMock, { status: 404, statusText: 'Not found' });
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
