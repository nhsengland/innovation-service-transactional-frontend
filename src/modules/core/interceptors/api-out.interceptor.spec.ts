import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ENV, SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { PLATFORM_ID } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationService } from '@modules/stores';

describe('Core/Interceptors/ApiOutInterceptor running SERVER side', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }

      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationService = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should add Cookie header', () => {

    const responseMock = true;
    let response: any = null;

    authenticationService.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(true);

  });

});





describe('Core/Interceptors/ApiOutInterceptor running CLIENT side', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let authenticationService: AuthenticationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV },

        { provide: PLATFORM_ID, useValue: 'browser' },

      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationService = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should NOT add Cookie header', () => {

    const responseMock = true;
    let response: any = null;

    authenticationService.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(false);

  });

});
