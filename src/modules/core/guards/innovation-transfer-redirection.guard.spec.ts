import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { PLATFORM_ID } from '@angular/core';
import { REQUEST, RESPONSE } from '../../../express.tokens';
import { ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationService } from '../services/innovation.service';

import { InnovationTransferRedirectionGuard } from './innovation-transfer-redirection.guard';

describe('Core/Guards/InnovationTransferRedirectionGuard running SERVER side', () => {
  let innovationService: InnovationService;

  let guard: InnovationTransferRedirectionGuard;

  const routeMock: Partial<ActivatedRouteSnapshot> = {
    routeConfig: { path: 'transfers/transferID01' },
    params: { id: 'transferID01' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, LoggerTestingModule, CoreModule, StoresModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }
      ]
    });

    innovationService = TestBed.inject(InnovationService);

    guard = TestBed.inject(InnovationTransferRedirectionGuard);
  });

  it('should deny access and redirect', () => {
    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => of({ userExists: true });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.
  });

  it('should deny access and redirect to error page', () => {
    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => throwError(false);

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.
  });
});

describe('Core/Guards/InnovationTransferRedirectionGuard running CLIENT side', () => {
  let innovationService: InnovationService;

  let guard: InnovationTransferRedirectionGuard;

  const routeMock: Partial<ActivatedRouteSnapshot> = {
    routeConfig: { path: 'transfers/transferID01' },
    params: { id: 'transferID01' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, LoggerTestingModule, CoreModule, StoresModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    innovationService = TestBed.inject(InnovationService);

    guard = TestBed.inject(InnovationTransferRedirectionGuard);
  });

  it('should deny access and redirect to signin', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => of({ userExists: true });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signin');
  });

  it('should deny access and redirect to signup', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => of({ userExists: false });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signup');
  });

  it('should deny access and redirect to error page', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationTransfer = () => throwError(false);

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/error');
  });
});
