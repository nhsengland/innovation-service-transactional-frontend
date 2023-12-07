import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from 'express';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

import { LoggerService, Severity } from '../services/logger.service';
import { InnovationService } from '../services/innovation.service';

@Injectable()
export class InnovationTransferRedirectionGuard {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private loggerService: LoggerService,
    private innovationService: InnovationService
  ) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
    const transferId = activatedRouteSnapshot.params.id;

    return this.innovationService.getInnovationTransfer(transferId).pipe(
      map(response => {
        let redirectUrl = '';

        if (response.userExists) {
          redirectUrl = '/transactional/signin';
        } else {
          redirectUrl = '/transactional/signup';
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

        this.loggerService.trackTrace('[InnovationTransferRedirectionGuard] error', Severity.ERROR, { error: e });

        const redirectUrl = '/transactional/error';

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
