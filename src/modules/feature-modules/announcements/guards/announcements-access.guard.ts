import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CtxStore } from '@modules/stores';

@Injectable()
export class AnnouncementsAccessGuard {
  constructor(
    private router: Router,
    private ctx: CtxStore
  ) {}

  canActivate(): boolean {
    const userContext = this.ctx.user.getUserContext();

    if (!userContext) {
      this.router.navigate(['/switch-user-context']);
      return false;
    }

    if (!this.ctx.user.isTermsOfUseAccepted()) {
      const path = this.ctx.user.userUrlBasePath() + '/terms-of-use';
      this.router.navigateByUrl(path);
      return false;
    }

    if (!this.ctx.user.hasAnnouncements()) {
      this.router.navigateByUrl(this.ctx.user.userUrlBasePath());
      return false;
    }

    return true;
  }
}
