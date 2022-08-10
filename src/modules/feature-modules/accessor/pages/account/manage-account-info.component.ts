import { Component } from '@angular/core';
import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-accessor-pages-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageAccessorAccountManageAccountInfoComponent extends CoreComponent {

  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetOn: string
  };

  constructor() {

    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetOn: user.passwordResetOn
    };

  }

}
