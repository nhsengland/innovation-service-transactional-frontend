import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';
import * as common from '@angular/common';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationService  } from '@modules/stores';

describe('Core/Interceptors/ApiOutInterceptor', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let authenticationService: AuthenticationService;

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

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    authenticationService = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should add header', () => {

    const responseMock = true;
    let response: any = null;

    spyOn(common, 'isPlatformServer').and.returnValue(true);

    authenticationService.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(true);

  });

  it('should not add header', () => {

    const responseMock = true;
    let response: any = null;

    spyOn(common, 'isPlatformServer').and.returnValue(false);

    authenticationService.verifyUserSession().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.APP_URL}/session`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('HEAD');
    expect(httpRequest.request.headers.has('Cookie')).toEqual(false);

  });

});
