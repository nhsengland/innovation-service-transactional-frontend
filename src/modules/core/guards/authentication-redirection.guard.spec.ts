import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot } from '@angular/router';

import { EmptyMockComponent } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';

import { UserRoleEnum } from '@app/base/enums';

import { PLATFORM_ID, signal } from '@angular/core';
import { AuthenticationRedirectionGuard } from './authentication-redirection.guard';

describe('Core/Guards/AuthenticationRedirectionGuard', () => {
  let ctx: CtxStore;

  let guard: AuthenticationRedirectionGuard;

  let routerStateSnapshopMock: Partial<RouterStateSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          { path: 'dashboard', component: EmptyMockComponent },
          { path: 'assessment', component: EmptyMockComponent },
          { path: 'accessor', component: EmptyMockComponent },
          { path: 'innovator', component: EmptyMockComponent }
        ]),
        CoreModule,
        StoresModule
      ],
      declarations: [EmptyMockComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    ctx = TestBed.inject(CtxStore);

    guard = TestBed.inject(AuthenticationRedirectionGuard);

    routerStateSnapshopMock = { url: '' };
  });

  it('should deny access and redirect when user has terms of use to accept', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'terms-of-use' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.INNOVATOR);
    ctx.user.isTermsOfUseAccepted = signal(false);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should deny access and redirect when user type is empty or path is empty', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(undefined);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should deny access and redirect when user type is ASSESSMENT', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'dashboard' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ASSESSMENT);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ACCESSOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'dashboard' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ACCESSOR);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'dashboard' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.INNOVATOR);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ADMIN', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'dashboard' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ADMIN);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should deny access and redirect when user type is ASSESSMENT', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'innovator' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ASSESSMENT);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ACCESSOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'innovator' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ACCESSOR);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'accessor' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.INNOVATOR);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ADMIN', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'innovator' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.ADMIN);
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should allow access when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {
      routeConfig: { path: 'innovator' },
      queryParams: { dismissNotification: undefined }
    };
    ctx.user.getUserType = signal(UserRoleEnum.INNOVATOR);
    ctx.user.isTermsOfUseAccepted = signal(true);
    ctx.user.getUserContext = signal({ id: 'userId', roleId: 'id', type: UserRoleEnum.INNOVATOR });
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(true);
  });
});
