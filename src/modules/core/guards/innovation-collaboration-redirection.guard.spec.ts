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
import { InnovationCollaborationRedirectionGuard } from './innovation-collaboration-redirection.guard';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/ctx/innovation/innovation.enums';

describe('Core/Guards/InnovationCollaborationRedirectionGuard running SERVER side', () => {
  let innovationService: InnovationService;

  let guard: InnovationCollaborationRedirectionGuard;

  const routeMock: Partial<ActivatedRouteSnapshot> = {
    routeConfig: { path: 'innovations/innovationID01/collaborations/collaborationID01' },
    params: { innovationId: 'innovationID01', collaboratorId: 'collaborationID01' }
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

    guard = TestBed.inject(InnovationCollaborationRedirectionGuard);
  });

  it('should allow access', () => {
    let expected: boolean | null = null;

    innovationService.getInnovationCollaboration = () =>
      of({ userExists: true, collaboratorStatus: InnovationCollaboratorStatusEnum.PENDING });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(true);
  });

  it('should deny access and redirect to error page', () => {
    let expected: boolean | null = null;

    innovationService.getInnovationCollaboration = () =>
      of({ userExists: true, collaboratorStatus: InnovationCollaboratorStatusEnum.CANCELLED });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(null); // Response from canActivate does not get returned, as it is redirected.
  });
});

describe('Core/Guards/InnovationCollaborationRedirectionGuard running CLIENT side', () => {
  let innovationService: InnovationService;

  let guard: InnovationCollaborationRedirectionGuard;

  const routeMock: Partial<ActivatedRouteSnapshot> = {
    routeConfig: { path: 'innovations/innovationID01/collaborations/collaborationID01' },
    params: { innovationId: 'innovationID01', collaboratorId: 'collaborationID01' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, LoggerTestingModule, CoreModule, StoresModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    innovationService = TestBed.inject(InnovationService);

    guard = TestBed.inject(InnovationCollaborationRedirectionGuard);
  });

  it('should deny access and redirect to signup', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationCollaboration = () =>
      of({ userExists: false, collaboratorStatus: InnovationCollaboratorStatusEnum.PENDING });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/signup');
  });

  it('should deny access and redirect to forbidden-collaborator error page', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationCollaboration = () =>
      of({ userExists: true, collaboratorStatus: InnovationCollaboratorStatusEnum.CANCELLED });

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/error/forbidden-collaborator');
  });

  it('should deny access and redirect to generic error page', () => {
    delete (window as { location?: {} }).location;
    window.location = { href: '', hostname: '', pathname: '', protocol: '', assign: jest.fn() } as unknown as Location;

    let expected: boolean | null = null;

    innovationService.getInnovationCollaboration = () => throwError(false);

    guard.canActivate(routeMock as any).subscribe(response => {
      expected = response;
    });
    expect(expected).toBe(false);
    expect(window.location.assign).toBeCalledWith('/transactional/error');
  });
});
