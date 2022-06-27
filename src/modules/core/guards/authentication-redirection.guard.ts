import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

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

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {

    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userType = this.authentication.getUserType() || '';

    const userTOUInfo = this.authentication.getUserTermsOfUseInfo();

    if (pathSegment === 'dashboard') {
      if (userType !== 'ADMIN' && !userTOUInfo) {
        const path = userTypePaths[userType] + '/terms-of-use';
        this.router.navigateByUrl(path);
      }
      else {
        this.router.navigateByUrl(userTypePaths[userType]);
      }
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
