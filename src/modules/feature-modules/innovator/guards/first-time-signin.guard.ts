import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CtxStore } from '@modules/stores';

@Injectable()
export class FirstTimeSigninGuard {
  constructor(
    private router: Router,
    private ctx: CtxStore
  ) {}

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (state.url.endsWith('terms-of-use')) {
      return of(true);
    }

    if (this.ctx.user.isFirstTimeSignInDone()) {
      // Don't allow to access First Time Signin, if already has been done.
      if (!['first-time-signin', ':id'].includes(activatedRouteSnapshot.routeConfig?.path || '')) {
        return of(true);
      }

      this.router.navigate(['/innovator/dashboard']);
      return of(false);
    }

    // It's mandatory to proceed to First Time Signin on the first time.
    if (['first-time-signin', ':id'].includes(activatedRouteSnapshot.routeConfig?.path || '')) {
      return of(true);
    }

    this.router.navigate(['/innovator/first-time-signin']);
    return of(false);
  }
}
