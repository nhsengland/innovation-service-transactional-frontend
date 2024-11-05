import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';
import { AuthenticationService } from '@modules/stores';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';

@Component({
  selector: 'shared-pages-account-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageSharedAccountManageAccountInfoComponent extends CoreComponent implements OnInit {
  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetAt: null | DateISOType;
  };

  MFAInfo: MFAInfoDTO | null = null;

  isInnovator: boolean = this.stores.authentication.isInnovatorType();

  constructor(private authenticationService: AuthenticationService) {
    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();

    this.user = {
      passwordResetAt: user.passwordResetAt
    };

    if (user.passwordChangeSinceLastSignIn) {
      this.authenticationService.getUserInfo(true).subscribe({
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
    this.authenticationService.getUserMFAInfo().subscribe({
      next: response => {
        this.MFAInfo = response;
        this.setPageStatus('READY');
      }
    });
  }
}
