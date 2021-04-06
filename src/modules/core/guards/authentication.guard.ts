import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from 'express';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

import { EnvironmentStore } from '../../stores';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private serverResponse: Response,
    private environmentStore: EnvironmentStore
  ) { }

  canActivate(): Observable<boolean> {

    return this.environmentStore.initializeAuthentication$().pipe(
      map(response => response),
      catchError(() => {

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
