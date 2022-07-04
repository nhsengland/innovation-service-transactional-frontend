import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { COOKIES_USED } from '../../config/constants.config';


@Component({
  selector: 'app-policies-cookies-info',
  templateUrl: './cookies-info.component.html',
})
export class CookiesInfoComponent extends CoreComponent {

  cookiesUsed = COOKIES_USED;

  constructor() {

    super();
    this.setPageTitle('Cookies on the NHS innovation service');

  }

}
