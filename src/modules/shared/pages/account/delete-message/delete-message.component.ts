import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'shared-pages-account-delete-message',
  templateUrl: './delete-message.component.html'
})
export class PageAccountDeleteMessageComponent extends CoreComponent {

  constructor() {

    super();
    this.setPageTitle('Delete account successful');

    this.alert = {
      type: 'INFORMATION',
      title: 'You have successfully deleted your account'
    };

  }

}
