import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

// import { of, throwError } from 'rxjs';
// import * as common from '@angular/common';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

// import { LoggerService } from '../services/logger.service';


import { InnovationTransferRedirectionGuard } from './innovation-transfer-redirection.guard';


describe('Core/Guards/InnovationTransferRedirectionGuard', () => {

  let guard: InnovationTransferRedirectionGuard;
  let authenticationStore: AuthenticationStore;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        // EnvironmentStore,
        // InnovationTransferRedirectionGuard,
        // LoggerService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(InnovationTransferRedirectionGuard);
    authenticationStore = TestBed.inject(AuthenticationStore);

  });


  it('should allow to access the route', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'transfers/transferID01' } };
    let expected: boolean | null = null;

    // spyOn(authenticationStore, 'initializeAuthentication$').and.returnValue(of(true));

    guard.canActivate(routeMock as any).subscribe(response => { expected = response; });
    expect(expected).toBe(true);

  });

  // it('should deny access the route when running on browser', () => {

  //   spyOn(common, 'isPlatformBrowser').and.returnValue(true);
  //   spyOn(authenticationStore, 'initializeAuthentication$').and.returnValue(throwError('error'));

  //   const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'transfers/transferID01' } };

  //   let expected: boolean | null = null;

  //   delete (window as { location?: {} }).location;
  //   window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

  //   guard.canActivate(routeMock as any).subscribe(response => { expected = response; });

  //   expect(expected).toBe(false);
  //   expect(window.location.assign).toBeCalledWith('/transactional/signin');


  // });

});
