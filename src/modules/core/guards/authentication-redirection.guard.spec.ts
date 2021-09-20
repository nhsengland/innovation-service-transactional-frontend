import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRouteSnapshot } from '@angular/router';

import { EmptyMockComponent } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { AuthenticationRedirectionGuard } from './authentication-redirection.guard';


describe('Core/Guards/AuthenticationRedirectionGuard', () => {

  let authenticationStore: AuthenticationStore;

  let guard: AuthenticationRedirectionGuard;

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
      ]
    });

    authenticationStore = TestBed.inject(AuthenticationStore);

    guard = TestBed.inject(AuthenticationRedirectionGuard);

  });

  it('should deny access to the route when user type is empty', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => '';
    expect(guard.canActivate(routeMock as any)).toBe(false);
  });

  it('should deny access to the route when user type is ASSESSMENT', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => 'ASSESSMENT';
    expect(guard.canActivate(routeMock as any)).toBe(false);
  });

  it('should deny access to the route when user type is ACCESSOR', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => 'ACCESSOR';
    expect(guard.canActivate(routeMock as any)).toBe(false);
  });

  it('should deny access to the route when user type is INNOVATOR', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    authenticationStore.getUserType = () => 'INNOVATOR';
    expect(guard.canActivate(routeMock as any)).toBe(false);
  });

  it('should allow to access the route', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = {};
    authenticationStore.getUserType = () => '';
    expect(guard.canActivate(routeMock as any)).toBe(true);
  });

});
