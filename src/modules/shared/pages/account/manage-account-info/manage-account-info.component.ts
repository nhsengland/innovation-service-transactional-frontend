import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';
import { MFAInfo, UserContextService } from '@modules/stores/ctx/user/user.service';

@Component({
  selector: 'shared-pages-account-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageSharedAccountManageAccountInfoComponent extends CoreComponent implements OnInit {
  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetAt: null | DateISOType;
  };

  MFAInfo: MFAInfo | null = null;

  constructor(private userCtxService: UserContextService) {
    super();
    this.setPageTitle('Manage account');

    // TODO: Check this component, can problem remove all of this calls and just use the state.
    const user = this.ctx.user.getUserInfo();

    this.user = {
      passwordResetAt: user.passwordResetAt
    };

    if (user.passwordChangeSinceLastSignIn) {
      this.userCtxService.getUserInfo(true).subscribe({
        next: updatedUser => {
          this.user = {
            passwordResetAt: updatedUser.passwordResetAt
          };
        },
        error: error => {
          console.error('Failed to fetch user info:', error);
        }
      });
    }
  }

  ngOnInit(): void {
    this.userCtxService.getUserMFAInfo().subscribe({
      next: response => {
        this.MFAInfo = response;
        this.setPageStatus('READY');
      }
    });
  }
}
