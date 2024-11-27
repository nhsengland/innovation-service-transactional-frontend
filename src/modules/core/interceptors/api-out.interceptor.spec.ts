import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PLATFORM_ID, signal } from '@angular/core';
import { REQUEST, RESPONSE } from '../../../express.tokens';

import { ENV, SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { UserRoleEnum } from '@app/base/enums';
import { CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { AuthenticationService, CtxStore, StoresModule } from '@modules/stores';
import { RouterModule } from '@angular/router';

describe('Core/Interceptors/ApiOutInterceptor running SERVER side', () => {
  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationService: AuthenticationService;
  let ctx: CtxStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    ctx = TestBed.inject(CtxStore);
    authenticationService = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Cookie header', () => {
    const responseMock = true;
    let response: any = null;

    ctx.user.getUserContext = signal({
      id: 'userId',
      roleId: '123',
      type: UserRoleEnum.ADMIN
    });
    authenticationService
      .verifyUserSession()
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(true);
    expect(httpRequest.request.headers.has('x-is-role')).toEqual(true);
  });
});

describe('Core/Interceptors/ApiOutInterceptor running CLIENT side', () => {
  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentVariablesStore;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule],
      providers: [
        AuthenticationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV },

        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationService = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should NOT add Cookie header', () => {
    const responseMock = true;
    let response: any = null;

    authenticationService
      .verifyUserSession()
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(false);
  });
});
