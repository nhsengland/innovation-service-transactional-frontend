import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageHelper } from '@app/base/helpers';

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
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authentication: AuthenticationStore
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userType = this.authentication.getUserType() || '';
    const userContext = this.authentication.getUserContextInfo();
    const currentOrgUnitId = LocalStorageHelper.getObjectItem("orgUnitId");

    if(isPlatformServer(this.platformId)) {
      this.router.navigate(['']);
      return false;
    }
   
    if (userContext.type === '' && !currentOrgUnitId) {
      this.router.navigate(['/switch-user-context']);
      return false;
    }

    if (userContext.type === '' && !!currentOrgUnitId) {
      this.authentication.findAndPopulateUserContextFromLocastorage(currentOrgUnitId.id);
      return true;
    }

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
