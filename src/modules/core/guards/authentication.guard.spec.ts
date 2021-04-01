import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';
import * as common from '@angular/common';
import { of, throwError } from 'rxjs';

import { AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/authentication.service';


describe('Core/Services/AuthenticationGuard tests Suite', () => {

  let guard: AuthenticationGuard;
  let authenticationService: AuthenticationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
        StoresModule
      ],
      providers: [
        AuthenticationService,
        AuthenticationGuard
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(AuthenticationGuard);
    authenticationService = TestBed.inject(AuthenticationService);

  });


  it('should allow to access the route', () => {

    let expected: boolean | null = null;

    spyOn(authenticationService, 'verifySession').and.returnValue(of(true));

    guard.canActivate().subscribe(response => { expected = response; });
    expect(expected).toBe(true);

  });

  it('should deny access the route when running on browser', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    spyOn(authenticationService, 'verifySession').and.returnValue(throwError('error'));

    let expected: boolean | null = null;

    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    guard.canActivate().subscribe(response => { expected = response; });

    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signin');


  });

  it('should deny access the route when running on server', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    spyOn(authenticationService, 'verifySession').and.returnValue(throwError('error'));

    let expected: boolean | null = null;

    guard.canActivate().subscribe(response => { expected = response; });

    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.

  });


});
