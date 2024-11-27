import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CtxStore } from '@modules/stores';

@Injectable()
export class AuthenticationRedirectionGuard {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private ctx: CtxStore
  ) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const pathSegment = activatedRouteSnapshot.routeConfig?.path || '';
    const userContext = this.ctx.user.getUserContext();
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
      this.ctx.notifications.dismiss({ notificationIds: [dismissNotification] });
    }

    if (!state.url.endsWith('terms-of-use') && userContext?.type !== 'ADMIN' && !this.ctx.user.isTermsOfUseAccepted()) {
      const path = this.ctx.user.userUrlBasePath() + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (
      !state.url.endsWith('announcements') &&
      !state.url.includes('terms-of-use') &&
      userContext.type !== 'ADMIN' &&
      this.ctx.user.hasAnnouncements()
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
      this.router.navigateByUrl(this.ctx.user.userUrlBasePath(), alert && { state: alert });
      return false;
    }

    if (pathSegment === 'account/email-notifications') {
      const url = `${this.ctx.user.userUrlBasePath()}/${pathSegment}`;
      this.router.navigateByUrl(url);
      return false;
    }

    if (pathSegment === this.ctx.user.userUrlBasePath()) {
      this.ctx.notifications.fetchUnread$.next();
      return true;
    } else {
      this.router.navigateByUrl(this.ctx.user.userUrlBasePath());
      return false;
    }
  }
}
