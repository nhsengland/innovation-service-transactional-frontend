import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import * as common from '@angular/common';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { AuthenticationService } from '../services/authentication.service';


describe('Core/Interceptors/ApiOutInterceptor tests Suite', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: AuthenticationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AuthenticationService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AuthenticationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should add header', () => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);

    const expected = true;

    service.verifySession().subscribe(response => {
      expect(response).toBe(expected);
    });

    const httpRequest = httpMock.expectOne(`${environmentStore.ENV.API_URL}/session`);
    httpRequest.flush(expected);
    expect(httpRequest.request.headers.has('Cookie')).toEqual(true);

  });

  it('should not add header', () => {

    spyOn(common, 'isPlatformServer').and.returnValue(false);

    const expected = true;

    service.verifySession().subscribe(response => {
      expect(response).toBe(expected);
    });

    const httpRequest = httpMock.expectOne(`${environmentStore.ENV.API_URL}/session`);
    httpRequest.flush(expected);
    expect(httpRequest.request.headers.has('Cookie')).toEqual(false);

  });

});
