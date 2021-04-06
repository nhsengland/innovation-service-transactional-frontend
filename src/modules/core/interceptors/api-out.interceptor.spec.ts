import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import * as common from '@angular/common';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore, EnvironmentService  } from '@modules/stores';

describe('Core/Interceptors/ApiOutInterceptor tests Suite', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let environmentService: EnvironmentService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    environmentService = TestBed.inject(EnvironmentService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should add header', () => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);

    const expected = true;

    environmentService.verifyUserSession().subscribe(response => {
      expect(response).toBe(expected);
    });

    const httpRequest = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/session`);
    httpRequest.flush(expected);
    expect(httpRequest.request.headers.has('Cookie')).toEqual(true);

  });

  it('should not add header', () => {

    spyOn(common, 'isPlatformServer').and.returnValue(false);

    const expected = true;

    environmentService.verifyUserSession().subscribe(response => {
      expect(response).toBe(expected);
    });

    const httpRequest = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/session`);
    httpRequest.flush(expected);
    expect(httpRequest.request.headers.has('Cookie')).toEqual(false);

  });

});
