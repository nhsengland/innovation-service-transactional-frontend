import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { SwitchUserContextGuard } from './switch-user-contextguard';

import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { of } from 'rxjs';

describe('FeatureModules/Accessor/Guards/SwitchUserContextGuard', () => {

  let guard: SwitchUserContextGuard;
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
        SwitchUserContextGuard
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(SwitchUserContextGuard);
    authenticationStore = TestBed.inject(AuthenticationStore);
    
    routerStateSnapshopMock = { url: '' };

  });

  it('should redirect to switch-usercontext route if userContext is undefined', () => {
    const routeMock: Partial<ActivatedRouteSnapshot> = {};
    const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    let expected: null | boolean = null;
    const emptyContext: Required<AuthenticationModel>['userContext'] = {type: ''}

    authenticationStore.getUserContextInfo = () => emptyContext;

    guard.canActivateChild(routeMock as any, routerStateSnapshopMock as any).subscribe(response => { expected = response; });

    expect<null | boolean>(expected).toBe(true);
    expect(routerSpy).toHaveBeenCalledWith(['/switch-user-context']);

  });

});
