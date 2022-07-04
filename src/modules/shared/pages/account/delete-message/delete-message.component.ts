import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { AlertType } from '@app/base/types';


@Component({
  selector: 'shared-pages-account-delete-message',
  templateUrl: './delete-message.component.html'
})
export class PageAccountDeleteMessageComponent extends CoreComponent {

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
