import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { AlertType } from '@modules/core';


@Component({
  selector: 'shared-pages-account-delete-account-message',
  templateUrl: './delete-account-message.component.html'
})
export class PageAccountDeleteAccountMessageComponent extends CoreComponent {

  alert: AlertType = { type: null };


  constructor() {

    super();
    this.setPageTitle('Delete account successful');

    this.alert = {
      type: 'INFORMATION',
      title: 'You have successfully deleted your account'
    };

  }

}
