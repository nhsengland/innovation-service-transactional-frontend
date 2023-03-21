import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { FirstTimeSigninGuard } from './first-time-signin.guard';

describe('FeatureModules/Innovator/Guards/FirstTimeSigninGuard', () => {

  let guard: FirstTimeSigninGuard;
  let authenticationStore: AuthenticationStore;

  let routerStateSnapshopMock: Partial<RouterStateSnapshot>;

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

    routerStateSnapshopMock = { url: '' };

  });


  // describe('User is valid tests', () => {

  //   it('should allow to access the route', () => {

  //     const routeMock: Partial<ActivatedRouteSnapshot> = {};
  //     let expected: null | boolean = null;

  //     guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });
  //     expect<null | boolean>(expected).toBe(true);

  //   });

  //   it('should redirect to the dashboard page', () => {

  //     const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
  //     const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
  //     let expected: null | boolean = null;

  //     guard.canActivateChild(routeMock as any).subscribe(response => { expected = response; });

  //     expect<null | boolean>(expected).toBe(false);
  //     expect(routerSpy).toHaveBeenCalledWith(['/innovator/dashboard']);

  //   });

  // });


  describe('User is NOT valid tests', () => {

    it('should redirect to the Innovation Transfer Acceptance WITH innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
      let expected: null | boolean = null;

      authenticationStore.hasInnovationTransfers = () => true;

      guard.canActivateChild(routeMock as any, routerStateSnapshopMock as any).subscribe(response => { expected = response; });

      expect<null | boolean>(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/first-time-signin']);

    });

    it('should allow to access the route WITHOUT any innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'first-time-signin' } };
      let expected: null | boolean = null;

      authenticationStore.hasInnovationTransfers = () => false;

      guard.canActivateChild(routeMock as any, routerStateSnapshopMock as any).subscribe(response => { expected = response; });
      expect<null | boolean>(expected).toBe(true);

    });

    it('should redirect to the First Time SignIn WITHOUT any innovations transfer pending', () => {

      const routeMock: Partial<ActivatedRouteSnapshot> = {};
      const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
      let expected: null | boolean = null;

      authenticationStore.hasInnovationTransfers = () => false;

      guard.canActivateChild(routeMock as any, routerStateSnapshopMock as any).subscribe(response => { expected = response; });

      expect<null | boolean>(expected).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith(['/innovator/first-time-signin']);

    });

  });

  it('should allow access to terms of use', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'terms-of-use' } };
    const routerStateSnapshopMock: Partial<RouterStateSnapshot> = { url: 'terms-of-use' };
    let expected: null | boolean = null;

    authenticationStore.hasInnovationTransfers = () => false;

    guard.canActivateChild(routeMock as any, routerStateSnapshopMock as any).subscribe(response => { expected = response; });
    expect<null | boolean>(expected).toBe(true);

  });

});
