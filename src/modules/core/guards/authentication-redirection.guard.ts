import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageHelper } from '@app/base/helpers';
import { UserContext } from '@modules/stores/authentication/authentication.models';

import { AuthenticationStore } from '../../stores/authentication/authentication.store';

@Injectable()
export class AuthenticationRedirectionGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authentication: AuthenticationStore
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userContext = this.authentication.getUserContextInfo();
    const currentRole = LocalStorageHelper.getObjectItem<UserContext>("role");

    if(isPlatformServer(this.platformId)) {
      this.router.navigate(['']);
      return false;
    }
   
    if (!userContext?.type) {
      if (currentRole) {
        this.authentication.findAndPopulateUserContextFromLocalStorage();
      } else {
        this.router.navigate(['/switch-user-context']);
        return false;
      }
    }

    if (!state.url.endsWith('terms-of-use') && userContext?.type !== 'ADMIN' && !this.authentication.isTermsOfUseAccepted()) {
      const path = this.authentication.userUrlBasePath() + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (pathSegment === 'dashboard') {
      this.router.navigateByUrl(this.authentication.userUrlBasePath());
      return false;
    }

    if (pathSegment === this.authentication.userUrlBasePath()) {
      return true;
    } else {
      this.router.navigateByUrl(this.authentication.userUrlBasePath());
      return false;
    }

  }

}
