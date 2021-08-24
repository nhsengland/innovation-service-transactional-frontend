import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from 'express';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

import { AuthenticationStore } from '../../stores';
import { LoggerService, Severity } from '../services/logger.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private authentication: AuthenticationStore,
    private loggerService: LoggerService
  ) { }

  canActivate(): Observable<boolean> {

    return this.authentication.initializeAuthentication$().pipe(
      map(response => response),
      catchError((e) => {

        this.loggerService.trackTrace('[AuthenticationGuard] Sign In Error', Severity.ERROR, { error: e });

        const redirectUrl = '/transactional/signin';

        if (isPlatformBrowser(this.platformId)) {
          window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
          return of(false);
        }

        this.serverResponse.status(303).setHeader('Location', redirectUrl);
        this.serverResponse.end();
        return of(false);
      })
    );

  }

}
