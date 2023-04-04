import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';


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

    if (isPlatformServer(this.platformId)) {
      this.router.navigate(['']);
      return false;
    }

    if (!userContext) {
      this.router.navigate(['/switch-user-context']);
      return false;
    }

    if (!state.url.endsWith('terms-of-use') && userContext?.type !== 'ADMIN' && !this.authentication.isTermsOfUseAccepted()) {
      const path = this.authentication.userUrlBasePath() + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (!state.url.endsWith('announcements') && userContext.type !== 'ADMIN' && this.authentication.hasAnnouncements()) {
      this.router.navigate(['announcements']);
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
