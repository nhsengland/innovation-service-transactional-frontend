import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { EmptyMockComponent } from '@tests/app.mocks';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { AppInjector } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

import { EnvironmentStore } from '../stores/environment.store';
import { AuthenticationRedirectionGuard } from './authentication-redirection.guard';


describe('Core/Guards/AuthenticationRedirectionGuard', () => {

  let guard: AuthenticationRedirectionGuard;
  let authenticationStore: AuthenticationStore;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: EmptyMockComponent },
          { path: 'innovator', component: EmptyMockComponent },
          { path: 'accessor', component: EmptyMockComponent }
        ]),
        LoggerTestingModule
      ],
      declarations: [
        EmptyMockComponent
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        EnvironmentStore,
        AuthenticationRedirectionGuard
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(AuthenticationRedirectionGuard);
    authenticationStore = TestBed.inject(AuthenticationStore);

  });


  it('should deny access to the route when user type is empty', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    const expected = false;

    spyOn(authenticationStore, 'getUserType').and.returnValue('');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  it('should deny access to the route when is a INNOVATOR', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    const expected = false;

    spyOn(authenticationStore, 'getUserType').and.returnValue('INNOVATOR');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  it('should deny access to the route when is a ACCESSOR', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    const expected = false;

    spyOn(authenticationStore, 'getUserType').and.returnValue('ACCESSOR');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  it('should allow to access the route', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = {};
    let expected = true;

    spyOn(authenticationStore, 'getUserType').and.returnValue('');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

});
