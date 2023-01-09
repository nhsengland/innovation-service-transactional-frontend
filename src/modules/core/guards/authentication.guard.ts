import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationStore } from '../../stores/authentication/authentication.store';
import { LoggerService, Severity } from '../services/logger.service';
import { EnvironmentVariablesStore } from '../stores/environment-variables.store';
import { UserTypeEnum } from '@app/base/enums';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private environmentStore: EnvironmentVariablesStore,
    private authentication: AuthenticationStore,
    private loggerService: LoggerService, private router: Router
  ) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authentication.initializeAuthentication$().pipe(
      map(response => {
        const userInfo = this.authentication.getUserInfo();
        const userContext = this.authentication.getUserContextInfo();
        const redirectToSwitchUser = !userContext && userInfo.type === UserTypeEnum.ACCESSOR && userInfo.organisations.length === 1 && !state.url.includes('/switch-user-context');

        if(redirectToSwitchUser) {
          if (isPlatformBrowser(this.platformId)) {
            window.location.assign(`${this.environmentStore.APP_URL}/switch-user-context`); // Full reload is needed to hit SSR.
            return true;
          }
        }

        return response;
      }),
      catchError((e: HttpErrorResponse) => {

        this.loggerService.trackTrace('[AuthenticationGuard] Sign In Error', Severity.ERROR, { error: e });

        // 401: User in not authenticated on identity provider.
        // 4xx: User is authenticated, but has no permission. (Ex: user is blocked).
        const redirectUrl = e.status === 401 ? `${this.environmentStore.APP_URL}/signin?back=${state.url}` : `${this.environmentStore.APP_URL}/signout?redirectUrl=${this.environmentStore.APP_URL}/error/unauthenticated`;

        if (isPlatformBrowser(this.platformId)) {
          window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
          return of(false);
        }

        this.serverResponse.status(303).setHeader('Location', redirectUrl);
        /* istanbul ignore next */
        this.serverResponse.end();
        /* istanbul ignore next */
        return of(false);

      })
    );

  }

}
