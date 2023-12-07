import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-policies-cookies-edit-confirmation',
  templateUrl: './cookies-edit-confirmation.component.html'
})
export class CookiesEditConfirmationComponent extends CoreComponent {
  constructor() {
    super();

    this.setPageTitle('Your cookie settings have been saved');
  }
}
