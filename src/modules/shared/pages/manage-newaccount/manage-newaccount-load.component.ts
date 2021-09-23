
import { Component} from '@angular/core';
import { CoreComponent } from '@app/base';
import { AlertType } from '@modules/core';


@Component({
   selector: 'shared-pages-manage-newaccount',
   templateUrl: './manage-newaccount-load.component.html'
})
export class PageAccountManageUserAccountNewComponent extends CoreComponent {
  alert: AlertType = { type: null };

  constructor() {

    super();
    this.setPageTitle('DeleteAccount');
    this.alert = {
      type: 'INFORMATION',
      title: 'You have successfully deleted your account'
    };
      }

}
