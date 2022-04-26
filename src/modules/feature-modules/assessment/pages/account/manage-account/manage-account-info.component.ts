import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

@Component({
  selector: 'app-assessment-pages-manage-account-info',
  templateUrl: './manage-account-info.component.html',
})
export class PageAccountAssessmentManageAccountInfoComponent extends CoreComponent implements OnInit
{
  alert: AlertType = { type: null };
  changePassword = `${this.stores.environment.APP_URL}/change-password`;

  user: {
    passwordResetOn: string;
  };
  constructor(private activatedRoute: ActivatedRoute) {
    super();
    this.setPageTitle('Manage account');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      passwordResetOn: user.passwordResetOn,
    };
  }
}
