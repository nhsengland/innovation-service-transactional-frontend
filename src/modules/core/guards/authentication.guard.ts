import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RESPONSE } from '../../../express.tokens';
import { Response } from 'express';

import { LoggerService, Severity } from '../services/logger.service';
import { EnvironmentVariablesStore } from '../stores/environment-variables.store';
import { CtxStore } from '@modules/stores';

@Injectable()
export class AuthenticationGuard {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private environmentStore: EnvironmentVariablesStore,
    private ctx: CtxStore,
    private loggerService: LoggerService
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.ctx.user.initializeAuthentication$().pipe(
      map(response => response),
      catchError((e: HttpErrorResponse) => {
        this.loggerService.trackTrace(
          '[AuthenticationGuard] Sign In Error',
          e.status === 401 ? Severity.VERBOSE : Severity.ERROR,
          { error: e }
        );

        // 401: User in not authenticated on identity provider.
        // 4xx: User is authenticated, but has no permission. (Ex: user is blocked).
        const redirectUrl =
          e.status === 401
            ? `${this.environmentStore.APP_URL}/signin?back=${state.url}`
            : `${this.environmentStore.APP_URL}/signout?redirectUrl=${this.environmentStore.APP_URL}/error/unauthenticated`;

        if (isPlatformBrowser(this.platformId)) {
          window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
          return of(false);
        }

        this.serverResponse.redirect(redirectUrl);
        return of(false);
      })
    );
  }
}
