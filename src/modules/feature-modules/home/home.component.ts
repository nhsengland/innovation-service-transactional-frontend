import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
})
export class HomeComponent extends CoreComponent {

  signInUrl: string;


  constructor() {

    super();

    this.signInUrl = `${this.CONSTANTS.APP_URL}/dashboard`;

    this.setPageTitle('Home', { showPage: false });
    this.setPageStatus('READY');

  }

}
