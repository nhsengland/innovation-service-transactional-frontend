import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';


@Component({
  selector: 'shared-pages-account-account-info',
  templateUrl: './account-info.component.html'
})
export class PageAccountInfoComponent extends CoreComponent {

  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetAt: null | DateISOType
  };


  constructor() {

    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetAt: user.passwordResetAt
    };

    this.setPageStatus('READY');

  }

}
