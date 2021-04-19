import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { EmptyComponentMock } from '@tests/app.mocks';

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
          { path: 'dashboard', component: EmptyComponentMock },
          { path: 'innovator', component: EmptyComponentMock },
          { path: 'accessor', component: EmptyComponentMock }
        ]),
        LoggerTestingModule
      ],
      declarations: [
        EmptyComponentMock
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


  it('should allow to access the route', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    let expected = false;
    
    spyOn(authenticationStore, 'getUserType').and.returnValue('INNOVATOR');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  it('should allow to access the route', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'dashboard' } };
    let expected = false;
    
    spyOn(authenticationStore, 'getUserType').and.returnValue('ACCESSOR');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  it('should allow to access the route', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: '' } };
    let expected = true;
    
    spyOn(authenticationStore, 'getUserType').and.returnValue('');

    expect(guard.canActivate(routeMock as any)).toBe(expected);

  });

  // it('should deny access the route when running on browser', () => {

  //   spyOn(common, 'isPlatformBrowser').and.returnValue(true);
  //   spyOn(authenticationStore, 'initializeAuthentication$').and.returnValue(throwError('error'));

  //   let expected: boolean | null = null;

  //   delete (window as { location?: {} }).location;
  //   window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

  //   guard.canActivate().subscribe(response => { expected = response; });

  //   expect(expected).toBe(false);
  //   expect(window.location.assign).toBeCalledWith('/transactional/signin');


  // });

  // it('should deny access the route when running on server', () => {

  //   spyOn(common, 'isPlatformBrowser').and.returnValue(false);
  //   spyOn(authenticationStore, 'initializeAuthentication$').and.returnValue(throwError('error'));

  //   let expected: boolean | null = null;

  //   guard.canActivate().subscribe(response => { expected = response; });

  //   expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.

  // });

});
