import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/models';


@Component({
  selector: 'app-admin-pages-service-users-find',
  templateUrl: './service-users-find.component.html'
})
export class PageServiceUsersFindComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New user', url: '/admin/service-users/new' }
  ];

  constructor() {

    super();
    this.setPageTitle('Service users');

  }

  ngOnInit(): void { }

}
