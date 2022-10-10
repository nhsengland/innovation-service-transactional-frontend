import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-authentication-pages-sign-up-confirmation',
  templateUrl: './sign-up-confirmation.component.html',
})
export class SignUpConfirmationComponent extends CoreComponent {

  proceedLink = `${this.CONSTANTS.APP_URL}/dashboard`;

  constructor() {

    super();
    this.setPageTitle('Account created', { showPage: false });

  }

}
