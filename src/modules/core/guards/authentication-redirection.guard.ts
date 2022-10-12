import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationStore } from '../../stores/authentication/authentication.store';


const userTypePaths = {
  '': 'innovator',
  ADMIN: 'admin',
  ASSESSMENT: 'assessment',
  ACCESSOR: 'accessor',
  INNOVATOR: 'innovator'
};


@Injectable()
export class AuthenticationRedirectionGuard implements CanActivate {

  constructor(
    private router: Router,
    private authentication: AuthenticationStore
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userType = this.authentication.getUserType() || '';

    if (!state.url.endsWith('terms-of-use') && userType !== 'ADMIN' && !this.authentication.isTermsOfUseAccepted()) {
      const path = userTypePaths[userType] + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (pathSegment === 'dashboard') {
      this.router.navigateByUrl(userTypePaths[userType]);
      return false;
    }

    if (pathSegment === userTypePaths[userType]) {
      return true;
    } else {
      this.router.navigateByUrl(userTypePaths[this.authentication.getUserType()]);
      return false;
    }

  }

}
