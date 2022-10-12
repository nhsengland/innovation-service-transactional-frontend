import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-admin-pages-account-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageAccountManageAccountInfoComponent extends CoreComponent {

  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetAt: null | string
  };

  constructor() {

    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetAt: user.passwordResetAt
    };

  }

}
