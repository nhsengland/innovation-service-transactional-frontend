import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { AuthenticationService } from './authentication.service';


describe('Core/Services/AuthenticationService tests Suite', () => {

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


  it('should run verifySession() method', () => {

    const expected = true;

    service.verifySession().subscribe(response => {
      expect(response).toBe(expected);
    });

    const request = httpMock.expectOne(`${environmentStore.ENV.API_URL}/session`);
    request.flush(expected);
    expect(request.request.method).toBe('HEAD');

  });

});
