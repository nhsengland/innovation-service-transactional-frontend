import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { getInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

@Component({
  selector: 'shared-pages-account-manage-account-info',
  templateUrl: './manage-account-info.component.html'
})
export class PageAccountManageAccountInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  changePassword = `${this.stores.environment.APP_URL}/change-password`;
  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage account');
     }

}
