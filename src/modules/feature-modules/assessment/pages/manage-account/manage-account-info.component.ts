import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';

@Component({
  selector: 'app-assessment-pages-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageAssessmentAccountManageAccountInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetOn: string
  };
  constructor(

  ) {

    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetOn: user.passwordResetOn
    };
  }

}
