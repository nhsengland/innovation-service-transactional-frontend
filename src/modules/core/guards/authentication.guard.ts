import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST) private serverRequest: Request,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (this.serverRequest?.headers.isAuthenticated === 'true') {
      return of(true);
    }

    return this.authenticationService.verifySession().pipe(
      map(result => result),
      catchError((err) => {

        const redirectUrl = '/transactional/signin';

        if (isPlatformBrowser(this.platformId)) {
          window.location.href = redirectUrl; // Full reload is needed to hit SSR.
          return of(false);
        }

        this.serverResponse?.status(303);
        this.serverResponse?.setHeader('Location', redirectUrl);
        this.serverResponse?.end();
        return of(false);

      })
    );

  }

}
