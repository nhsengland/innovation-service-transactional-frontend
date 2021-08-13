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


  describe('User is valid tests', () => {

    it('should allow to access the route', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => true;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
      expect(expected).toBe(true);

    });

    it('should redirect to the dashboard page', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => true;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

      expect(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/dashboard']);

    });

  });


  describe('User is NOT valid tests', () => {

    it('should allow to access the route WITH innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'innovation-transfer-acceptance' } };
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => false;
      authenticationStore.hasInnovationTransfers = () => true;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
      expect(expected).toBe(true);

    });

    it('should redirect to the Innovation Transfer Acceptance WITH innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => false;
      authenticationStore.hasInnovationTransfers = () => true;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

      expect(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovation-transfer-acceptance']);

    });

    it('should allow to access the route WITHOUT any innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => false;
      authenticationStore.hasInnovationTransfers = () => false;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
      expect(expected).toBe(true);

    });

    it('should redirect to the First Time SignIn WITHOUT any innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      let expected: boolean | null = null;

      authenticationStore.isValidUser = () => false;
      authenticationStore.hasInnovationTransfers = () => false;

      guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

      expect(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/first-time-signin']);

    });

  });




});
