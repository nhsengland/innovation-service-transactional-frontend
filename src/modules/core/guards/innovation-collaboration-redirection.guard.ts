import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from 'express';
import { RESPONSE } from '../../../express.tokens';

import { LoggerService, Severity } from '../services/logger.service';
import { InnovationService } from '../services/innovation.service';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/ctx/innovation/innovation.enums';

@Injectable()
export class InnovationCollaborationRedirectionGuard {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private loggerService: LoggerService,
    private innovationService: InnovationService
  ) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
    const collaboratorId = activatedRouteSnapshot.params.collaboratorId;

    return this.innovationService.getInnovationCollaboration(collaboratorId).pipe(
      map(response => {
        let redirectUrl = '';

        if (response.collaboratorStatus !== InnovationCollaboratorStatusEnum.PENDING) {
          redirectUrl = '/transactional/error/forbidden-collaborator';
        } else if (!response.userExists) {
          redirectUrl = '/transactional/signup';
        } else {
          return true;
        }
        if (isPlatformBrowser(this.platformId)) {
          window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
        } else {
          this.serverResponse.status(303).setHeader('Location', redirectUrl);
          /* istanbul ignore next */
          this.serverResponse.end();
        }

        return false;
      }),
      catchError(e => {
        // Request no longer valid, redirect to error.
        let redirectUrl = '';

        this.loggerService.trackTrace('[InnovationCollaborationRedirectionGuard] error', Severity.ERROR, { error: e });

        redirectUrl = '/transactional/error';

        if (isPlatformBrowser(this.platformId)) {
          window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
        } else {
          this.serverResponse.status(303).setHeader('Location', redirectUrl);
          /* istanbul ignore next */
          this.serverResponse.end();
        }

        return of(false);
      })
    );
  }
}
