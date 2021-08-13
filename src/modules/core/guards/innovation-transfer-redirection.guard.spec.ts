import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationService } from '../services/innovation.service';

import { InnovationTransferRedirectionGuard } from './innovation-transfer-redirection.guard';


describe('Core/Guards/InnovationTransferRedirectionGuard', () => {

  let guard: InnovationTransferRedirectionGuard;
  let innovationService: InnovationService;

  const routeMock: Partial<ActivatedRouteSnapshot> = { routeConfig: { path: 'transfers/transferID01' }, params: { id: 'transferID01' } };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    guard = TestBed.inject(InnovationTransferRedirectionGuard);
    innovationService = TestBed.inject(InnovationService);

  });


  it('should deny access and redirect to signin', () => {

    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => of({ userExists: true });

    guard.canActivate(routeMock as any).subscribe(response => { expected = response; });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signin');

  });


  it('should deny access and redirect to signup', () => {

    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => of({ userExists: false });

    guard.canActivate(routeMock as any).subscribe(response => { expected = response; });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signup');

  });


  it('should deny access and redirect to error page', () => {

    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => throwError(false);

    guard.canActivate(routeMock as any).subscribe(response => { expected = response; });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/error');

  });

});
