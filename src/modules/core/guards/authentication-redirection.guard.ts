import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthenticationStore } from '../../stores';


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
