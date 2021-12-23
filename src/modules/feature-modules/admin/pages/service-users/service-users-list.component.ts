import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/models';


@Component({
  selector: 'app-admin-pages-service-users-list',
  templateUrl: './service-users-list.component.html'
})
export class PageServiceUsersListComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New user', url: '/admin/service-users/new' }
  ];

  constructor() {

    super();
    this.setPageTitle('Service users');

  }

  ngOnInit(): void { }

}
