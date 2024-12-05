import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PLATFORM_ID } from '@angular/core';
import { REQUEST, RESPONSE } from '../../../express.tokens';
import { of, throwError } from 'rxjs';

import { SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';

import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';

describe('Core/Guards/AuthenticationGuard running SERVER side', () => {
  let ctx: CtxStore;

  let guard: AuthenticationGuard;

  let routerStateSnapshopMock: Partial<RouterStateSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }
      ]
    });

    ctx = TestBed.inject(CtxStore);

    guard = TestBed.inject(AuthenticationGuard);

    routerStateSnapshopMock = { url: '' };
  });

  it('should deny access to the route', () => {
    let expected: boolean | null = null;

    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {};

    ctx.user.initializeAuthentication$ = () => throwError('error');

    guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any).subscribe(response => {
      expected = response;
    });

    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.
  });
});

describe('Core/Guards/AuthenticationGuard running CLIENT side', () => {
  let ctx: CtxStore;

  let guard: AuthenticationGuard;

  let routerStateSnapshopMock: Partial<RouterStateSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    ctx = TestBed.inject(CtxStore);

    guard = TestBed.inject(AuthenticationGuard);

    routerStateSnapshopMock = { url: '' };
  });

  it('should allow access to the route', () => {
    let expected!: boolean;

    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {};

    ctx.user.initializeAuthentication$ = () => of(true);

    guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(true);
  });

  it('should deny access to the route', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected!: boolean;

    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {};

    ctx.user.initializeAuthentication$ = () => throwError('error');
    guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any).subscribe(response => {
      expected = response;
    });

    expect(expected).toBe(false);
  });
});
