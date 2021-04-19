import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { FirstTimeSigninGuard } from './first-time-signin.guard';

describe('FeatureModules/Innovator/Guards/FirstTimeSigninGuard', () => {

  let guard: FirstTimeSigninGuard;
  let authenticationStore: AuthenticationStore;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        FirstTimeSigninGuard
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(FirstTimeSigninGuard);
    authenticationStore = TestBed.inject(AuthenticationStore);

  });


  describe('User did NOT First Time SignIn tests', () => {

    it('should allow to access the route', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
      let expected: boolean | null = null;

      spyOn(authenticationStore, 'didFirstTimeSignIn').and.returnValue(false);

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
      expect(expected).toBe(true);

    });

    it('should redirect to the First Time SignIn page', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      let expected: boolean | null = null;

      spyOn(authenticationStore, 'didFirstTimeSignIn').and.returnValue(false);

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

      expect(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/first-time-signin']);

    });

  });


  describe('User did First Time SignIn tests', () => {

    it('should allow to access the route', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      let expected: boolean | null = null;

      spyOn(authenticationStore, 'didFirstTimeSignIn').and.returnValue(true);

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
      expect(expected).toBe(true);

    });

    it('should redirect to the dashboard page', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      let expected: boolean | null = null;

      spyOn(authenticationStore, 'didFirstTimeSignIn').and.returnValue(true);

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

      expect(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/dashboard']);

    });

  });

});
