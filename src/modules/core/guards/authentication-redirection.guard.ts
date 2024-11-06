import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ContextStore } from '@modules/stores';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

@Injectable()
export class AuthenticationRedirectionGuard {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authentication: AuthenticationStore,
    private contextStore: ContextStore
  ) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userContext = this.authentication.getUserContextInfo();
    const dismissNotification = activatedRouteSnapshot.queryParams.dismissNotification;

    if (isPlatformServer(this.platformId)) {
      this.router.navigate(['']);
      return false;
    }

    if (!userContext) {
      this.router.navigate(['/switch-user-context']);
      return false;
    }

    if (dismissNotification) {
      this.contextStore.dismissUserNotification({ notificationIds: [dismissNotification] });
    }

    if (
      !state.url.endsWith('terms-of-use') &&
      userContext?.type !== 'ADMIN' &&
      !this.authentication.isTermsOfUseAccepted()
    ) {
      const path = this.authentication.userUrlBasePath() + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (
      !state.url.endsWith('announcements') &&
      !state.url.includes('terms-of-use') &&
      userContext.type !== 'ADMIN' &&
      this.authentication.hasAnnouncements()
    ) {
      this.router.navigate(['announcements']);
      return false;
    }

    if (pathSegment === 'dashboard') {
      const alert =
        activatedRouteSnapshot.queryParams.state === 'CHANGE_PASSWORD'
          ? {
              alert: activatedRouteSnapshot.queryParams.state
            }
          : undefined;
      this.router.navigateByUrl(this.authentication.userUrlBasePath(), alert && { state: alert });
      return false;
    }

    if (pathSegment === 'account/email-notifications') {
      const url = `${this.authentication.userUrlBasePath()}/${pathSegment}`;
      this.router.navigateByUrl(url);
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
