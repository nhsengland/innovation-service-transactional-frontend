import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PLATFORM_ID } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { of, throwError } from 'rxjs';

import { SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { AuthenticationGuard } from './authentication.guard';


describe('Core/Guards/AuthenticationGuard running SERVER side', () => {

  let authenticationStore: AuthenticationStore;

  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }
      ]
    });

    authenticationStore = TestBed.inject(AuthenticationStore);

    guard = TestBed.inject(AuthenticationGuard);

  });

  it('should deny access to the route', () => {

    let expected: boolean | null = null;

    authenticationStore.initializeAuthentication$ = () => throwError('error');

    guard.canActivate().subscribe(response => { expected = response; });

    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.

  });

});





describe('Core/Guards/AuthenticationGuard running CLIENT side', () => {

  let authenticationStore: AuthenticationStore;

  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    authenticationStore = TestBed.inject(AuthenticationStore);

    guard = TestBed.inject(AuthenticationGuard);

  });

  it('should allow access to the route', () => {

    let expected: boolean | null = null;

    authenticationStore.initializeAuthentication$ = () => of(true);

    guard.canActivate().subscribe(response => { expected = response; });
    expect(expected).toBe(true);

  });

  it('should deny access to the route', () => {

    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    authenticationStore.initializeAuthentication$ = () => throwError('error');
    guard.canActivate().subscribe(response => { expected = response; });

    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signin');

  });

});
