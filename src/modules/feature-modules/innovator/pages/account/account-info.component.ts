import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-account-info',
  templateUrl: './account-info.component.html'
})
export class PageAccountInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  changePassword = `${this.CONSTANTS.APP_URL}/change-password`;

  user: {
    passwordResetOn: string
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetOn: user.passwordResetOn
    };
  }

}
