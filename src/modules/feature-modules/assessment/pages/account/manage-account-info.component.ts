import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { AuthenticationService } from '@modules/stores';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';

@Component({
  selector: 'app-assessment-pages-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageAssessmentAccountManageAccountInfoComponent extends CoreComponent implements OnInit {
  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetAt: null | string;
  };

  MFAInfo: MFAInfoDTO = { type: 'none' };

  constructor(private authenticationService: AuthenticationService) {
    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetAt: user.passwordResetAt
    };
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
