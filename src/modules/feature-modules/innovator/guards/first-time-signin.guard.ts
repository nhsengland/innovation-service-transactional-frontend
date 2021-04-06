import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { EnvironmentStore } from '@modules/stores';

@Injectable()
export class FirstTimeSigninGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private environmentStore: EnvironmentStore
  ) { }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {

    if (!this.environmentStore.userDidFirstTimeSignIn()) {

      // It's mandatory to proceed to First Time Signin on the first time.
      if (['first-time-signin', ':id'].includes(activatedRouteSnapshot.routeConfig?.path || '')) {
        return of(true);
      }

      this.router.navigate(['/innovator/first-time-signin']);
      return of(false);


    } else {

      // Don't allow to access First Time Signin, if already has been done.
      if (!['first-time-signin', ':id'].includes(activatedRouteSnapshot.routeConfig?.path || '')) {
        return of(true);
      }

      this.router.navigate(['/innovator/dashboard']);
      return of(false);

    }

  }

}
