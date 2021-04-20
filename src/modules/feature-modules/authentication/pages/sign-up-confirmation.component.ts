import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-authentication-pages-sign-up-confirmation',
  templateUrl: './sign-up-confirmation.component.html',
})
export class SignUpConfirmationComponent extends CoreComponent implements OnInit {

  proceedLink = `${this.stores.environment.APP_URL}/dashboard`;

  constructor() { super(); }

  ngOnInit(): void { }

}
