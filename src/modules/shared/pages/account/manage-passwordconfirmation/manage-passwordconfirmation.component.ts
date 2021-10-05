
import { Component } from '@angular/core';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'shared-pages-manage-passwordconfirmation',
  templateUrl: './manage-passwordconfirmation.component.html',
})
export class PageManagePasswordconfirmationMesasageComponent extends CoreComponent {
  proceedLink = `${this.stores.environment.APP_URL}/dashboard`;
  constructor() {

    super();
    this.setPageTitle('New password created');
  }

}
