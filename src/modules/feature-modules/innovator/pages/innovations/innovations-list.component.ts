import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';


@Component({
  selector: 'app-innovator-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovations: { id: string, name: string }[];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Choose innovation');

    this.innovations = this.stores.authentication.getUserInfo().innovations;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'innovationCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: `You have successfully registered the innovation '${this.activatedRoute.snapshot.queryParams.name}'`
        };
        break;
      default:
        break;
    }

  }

}
