import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { EmptyMockComponent } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { UserRoleEnum } from '@app/base/enums';

import { PLATFORM_ID } from '@angular/core';
import { AuthenticationRedirectionGuard } from './authentication-redirection.guard';


describe('Core/Guards/AuthenticationRedirectionGuard', () => {

  let authenticationStore: AuthenticationStore;

  let guard: AuthenticationRedirectionGuard;

  let routerStateSnapshopMock: Partial<RouterStateSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: EmptyMockComponent },
          { path: 'assessment', component: EmptyMockComponent },
          { path: 'accessor', component: EmptyMockComponent },
          { path: 'innovator', component: EmptyMockComponent }
        ]),
        CoreModule,
        StoresModule
      ],
      declarations: [
        EmptyMockComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    authenticationStore = TestBed.inject(AuthenticationStore);

    guard = TestBed.inject(AuthenticationRedirectionGuard);

    routerStateSnapshopMock = { url: '' };

  });

  it('should deny access and redirect when user has terms of use to accept', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'terms-of-use' } };
    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    authenticationStore.isTermsOfUseAccepted = () => false;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });


  it('should deny access and redirect when user type is empty or path is empty', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = {};
    authenticationStore.getUserType = () => undefined;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should deny access and redirect when user type is ASSESSMENT', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => UserRoleEnum.ASSESSMENT;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ACCESSOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => UserRoleEnum.ACCESSOR;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ADMIN', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => UserRoleEnum.ADMIN;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });


  it('should deny access and redirect when user type is ASSESSMENT', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'innovator' } };
    authenticationStore.getUserType = () => UserRoleEnum.ASSESSMENT;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ACCESSOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'innovator' } };
    authenticationStore.getUserType = () => UserRoleEnum.ACCESSOR;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'accessor' } };
    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });
  it('should deny access and redirect when user type is ADMIN', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'innovator' } };
    authenticationStore.getUserType = () => UserRoleEnum.ADMIN;
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(false);
  });

  it('should allow access when user type is INNOVATOR', () => {
    const activatedRouteSnapshotMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'innovator' } };
    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    authenticationStore.isTermsOfUseAccepted = () => true;
    authenticationStore.getUserContextInfo = () => { return {roleId: 'id', type: UserRoleEnum.INNOVATOR} }
    expect(guard.canActivate(activatedRouteSnapshotMock as any, routerStateSnapshopMock as any)).toBe(true);
  });

});
